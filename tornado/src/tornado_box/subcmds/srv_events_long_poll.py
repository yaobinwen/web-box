import asyncio
import concurrent.futures
import logging
import pathlib
import random
import tornado.web

from google.protobuf import json_format
from tornado_box.app_base import AppBase
from tornado_box.handler_base import HandlerBase
from tornado_box.v0.events_long_poll.event_pb2 import Event as EventExternal
from tornado_box.v0.events_long_poll.poll_pb2 import (
    EC_SUCCESS,
    EC_TOO_MANY_TIMEOUTS,
    EC_TIMEOUT_NOT_NUMERIC,
    EC_TIMEOUT,
    PollResponse,
)


logger = logging.getLogger(pathlib.Path(__file__).name)


class EventInternal(object):
    def __init__(self, num=None):
        self._num = num

    @property
    def num(self):
        return self._num


class EventsLongPollHandlerBase(HandlerBase):
    def _add_headers(self):
        self.add_header("Content-Type", "application/json")
        self.allow_origin_if_needed()


class EventsGetHandler(EventsLongPollHandlerBase):
    def initialize(self, *, app):
        self.app = app

    def get(self, *args, **kwargs):
        logger.info("getting current events...")

        # Convert EventInternal instances to EventExternal instances.
        events = [EventExternal(num=e.num) for e in self.app.events]
        self.app.events = []

        self.set_status(200)
        self._add_headers()
        self.write(
            json_format.MessageToJson(
                PollResponse(code=EC_SUCCESS, events=events),
                including_default_value_fields=True,
                preserving_proto_field_name=True,
            )
        )
        self.finish()


class EventsPollHandler(EventsLongPollHandlerBase):
    def initialize(self, *, app):
        self.app = app

    def _request_error(self, http_code, error_code):
        self.set_status(http_code)
        self._add_headers()
        self.write(
            json_format.MessageToJson(
                PollResponse(code=error_code, events=[]),
                including_default_value_fields=True,
                preserving_proto_field_name=True,
            )
        )
        self.finish()

    def _bad_request(self, error_code):
        self._request_error(http_code=400, error_code=error_code)

    def _request_timeout(self):
        self._request_error(http_code=408, error_code=EC_TIMEOUT)

    async def get(self, *args, **kwargs):
        # By default, the request doesn't time out and will keep polling
        # forever.
        timeout_s = None

        timeout_list = self.request.query_arguments.get("timeout-in-s", None)
        if timeout_list:
            if len(timeout_list) > 1:
                return self._bad_request(error_code=EC_TOO_MANY_TIMEOUTS)
            else:
                try:
                    timeout_s = float(timeout_list[0])
                except ValueError:
                    return self._bad_request(error_code=EC_TIMEOUT_NOT_NUMERIC)

        logger.info(
            "polling for events (handler: %s; timeout: %s)...",
            id(self),
            timeout_s if timeout_s else "infinity",
        )

        if not self.app.events:
            try:
                await self.app.wait_for_events(timeout_s=timeout_s)
                logger.info("event occurred")
            except concurrent.futures.TimeoutError:
                return self._request_timeout()

        events = [EventExternal(num=e.num) for e in self.app.events]
        self.app.events = []

        self.set_status(200)
        self._add_headers()
        self.write(
            json_format.MessageToJson(
                PollResponse(code=EC_SUCCESS, events=events),
                including_default_value_fields=True,
                preserving_proto_field_name=True,
            )
        )
        self.finish()


class EventsTriggerHandler(EventsLongPollHandlerBase):
    def initialize(self, *, app):
        self.app = app

    def post(self, *args, **kwargs):
        event = json_format.Parse(self.request.body, EventExternal())

        self.app._trigger_event(num=event.num)

        self.set_status(200)
        self.allow_origin_if_needed()
        self.finish()


class App(AppBase):
    def __init__(self, *, address, port, random_events, random_events_interval_ms):
        super().__init__(address=address, port=port)

        # The list of all the events so far.
        self.events = []
        # For simplicity, the content of an event is merely an integer.
        self.event_number = 0

        self.event_occurred = asyncio.Event()

        # Whether the app is generating an event at this moment.
        self.generating_event = False

        # Whether the app should generate random events automatically. If not,
        # the user should call the appropriate HTTP endpoint to trigger the
        # generation of an event.
        self.random_events = random_events
        self.random_events_interval_ms = random_events_interval_ms

        # The timer that's used to generate the random events if `random_events`
        # is true.
        self.gen_event_timer = None
        if self.random_events:
            logger.info("setting up the random event generation timer...")
            random.seed()
            self.gen_event_timer = tornado.ioloop.PeriodicCallback(
                self._generate_event,
                callback_time=random_events_interval_ms,
                jitter=0.1,
            )
        else:
            logger.info("random event generation is not started")

    def _make_routes(self):
        routes = super()._make_routes()
        routes.extend(
            [
                (r"/events/get$", EventsGetHandler, dict(app=self)),
                (r"/events/poll$", EventsPollHandler, dict(app=self)),
                (r"/events/trigger$", EventsTriggerHandler, dict(app=self)),
            ]
        )
        return routes

    async def _start_gen_event_timer(self):
        if self.random_events:
            if not self.gen_event_timer.is_running():
                self.gen_event_timer.start()

    async def _stop_gen_event_timer(self):
        if self.random_events:
            if self.gen_event_timer.is_running():
                self.gen_event_timer.stop()

    def start(self):
        ioloop = tornado.ioloop.IOLoop.current()
        ioloop.add_callback(self._start_gen_event_timer)

        super().start()

    def stop(self):
        ioloop = tornado.ioloop.IOLoop.current()
        ioloop.add_callback(self._stop_gen_event_timer)

        super().stop()

    def _generate_event(self):
        generate = random.choice([True, False])
        if generate:
            self._trigger_event(num=self.event_number)
            self.event_number += 1

    def _trigger_event(self, num):
        if self.generating_event:
            return

        self.generating_event = True

        logger.debug("triggering an event '%s'...", num)
        self.events.append(EventInternal(num=num))

        self.event_occurred.set()
        self.event_occurred.clear()

        self.generating_event = False

    async def wait_for_events(self, timeout_s=None):
        future = asyncio.ensure_future(self.event_occurred.wait())
        await asyncio.wait_for(future, timeout=timeout_s)


def subcmd_srv_events_long_poll(
    address, port, random_events, random_events_interval_ms
):
    logger.info("subcmd_srv_events_long_poll")

    app = App(
        address=address,
        port=port,
        random_events=random_events,
        random_events_interval_ms=random_events_interval_ms,
    )
    app.start()


def syntax(subcmd):
    subcmd.add_argument(
        "--random-events",
        default=False,
        action="store_true",
        help="generate random events (default: %(default)s)",
    )

    subcmd.add_argument(
        "--random-events-interval-ms",
        default=1000,
        help="interval to generate random events (default: %(default)s ms)",
    )
