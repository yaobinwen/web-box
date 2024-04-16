import asyncio
import enum
import json
import logging
import pathlib
import random
import tornado.web

from tornado_box.app_base import AppBase
from tornado_box.handler_base import HandlerBase


logger = logging.getLogger(pathlib.Path(__file__).name)


class EventsGetHandler(HandlerBase):
    def initialize(self, *, app):
        self.app = app

    def get(self, *args, **kwargs):
        logger.info("getting current events...")

        events = json.dumps(self.app.events)
        self.app.events = []

        self.set_status(200)
        self.add_header("Content-Type", "application/json")
        self.allow_origin_if_needed()
        self.write(events)
        self.finish()


class EventsPollHandler(HandlerBase):
    def initialize(self, *, app):
        self.app = app

    async def get(self, *args, **kwargs):
        logger.info("polling for events (handler: %s)...", id(self))

        if not self.app.events:
            await self.app.wait_for_events()
            logger.info("event occurred")

        events = json.dumps(self.app.events)
        self.app.events = []

        self.set_status(200)
        self.add_header("Content-Type", "application/json")
        self.allow_origin_if_needed()
        self.write(events)
        self.finish()


class EventsTriggerHandler(HandlerBase):
    def initialize(self, *, app):
        self.app = app

    def post(self, *args, **kwargs):
        event = int(self.request.body.decode("utf-8"))

        self.app._trigger_event(event=event)

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
            self._trigger_event(event=self.event_number)
            self.event_number += 1

    def _trigger_event(self, event):
        if self.generating_event:
            return

        self.generating_event = True

        logger.debug("triggering an event '%s'...", event)
        self.events.append(event)

        self.event_occurred.set()
        self.event_occurred.clear()

        self.generating_event = False

    async def wait_for_events(self):
        await self.event_occurred.wait()


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
