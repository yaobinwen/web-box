import asyncio
import enum
import logging
import pathlib
import tornado.web


logger = logging.getLogger(pathlib.Path(__file__).name)


class SwitchState(enum.IntEnum):
    OFF = 0
    ON = 1


class SwitchStatusHandler(tornado.web.RequestHandler):
    def initialize(self, *, app):
        self.app = app

    def get(self, *args, **kwargs):
        state = int(self.app.switch_state)
        logger.info("switch state: %s", state)

        self.set_status(200)
        self.add_header("Content-Type", "text/plain")
        self.write(str(state))
        self.finish()

    def post(self, *args, **kwargs):
        enabling = bool(int(self.request.body))
        logger.info("enabling: %s", enabling)

        if enabling:
            if self.app.is_switch_off():
                logger.info("turning on the switch...")
                self.app.turn_on_switch()
            else:
                logger.info("switch is already on")
        else:
            if self.app.is_switch_on():
                logger.info("turning off the switch...")
                self.app.turn_off_switch()
            else:
                logger.info("switch is already off")


class SwitchPollHandler(tornado.web.RequestHandler):
    def initialize(self, *, app):
        self.app = app

    async def get(self, *args, **kwargs):
        logger.info("polling for switch state changes...")
        await self.app.wait_for_switch_state_changes()
        logger.info("switch state changed")

        state = int(self.app.switch_state)
        logger.info("switch new state: %s", state)

        self.set_status(200)
        self.add_header("Content-Type", "text/plain")
        self.write(str(state))
        self.finish()


class App(object):
    def __init__(
        self,
        *,
        address,
        port,
    ):
        self.address = address
        self.port = port

        self.app = self.server = None

        self.switch_state = SwitchState.OFF
        self.switch_state_changed = asyncio.Event()

    def is_switch_on(self):
        return self.switch_state == SwitchState.ON

    def is_switch_off(self):
        return self.switch_state == SwitchState.OFF

    def turn_on_switch(self):
        self.switch_state = SwitchState.ON
        self.switch_state_changed.set()
        self.switch_state_changed.clear()

    def turn_off_switch(self):
        self.switch_state = SwitchState.OFF
        self.switch_state_changed.set()
        self.switch_state_changed.clear()

    async def wait_for_switch_state_changes(self):
        await self.switch_state_changed.wait()

    def _make_app(self):
        handlers = [
            (
                r"/switch/status$",  # rw
                SwitchStatusHandler,
                dict(app=self),
            ),
            (
                r"/switch/poll$",  # ro
                SwitchPollHandler,
                dict(app=self),
            ),
        ]

        return tornado.web.Application(handlers)

    async def start(self):
        self.app = self._make_app()
        self.server = tornado.httpserver.HTTPServer(self.app, xheaders=False)
        self.server.listen(address=self.address, port=self.port)
        sockets = self.server._sockets.values()
        logger.info("listening to sockets: %s", sockets)


def subcmd_srv_pub_sub_long_poll(address, port):
    logger.info("subcmd_srv_pub_sub_long_poll")

    app = App(
        address=address,
        port=port,
    )
    ioloop = tornado.ioloop.IOLoop.current()
    ioloop.add_callback(app.start)
    ioloop.start()
