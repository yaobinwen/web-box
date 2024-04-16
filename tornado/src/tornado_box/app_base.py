import logging
import pathlib
import signal
import tornado
import tornado.web


logger = logging.getLogger(pathlib.Path(__file__).name)


class HealthzHandler(tornado.web.RequestHandler):
    def initialize(self, *, app):
        self.app = app

    def _check_health(self):
        self.set_status(202)
        self.finish()

    def head(self):
        self._check_health()

    def get(self):
        self._check_health()


class RequestPingHandler(tornado.web.RequestHandler):
    def initialize(self, *, app):
        self.app = app

    def get(self):
        logger.info("received ping, replying pong")

        self.write("pong")
        self.set_status(200)
        self.finish()


class AppBase(object):
    def __init__(self, *, address, port):
        self.address = address
        self.port = port

        self.web_app = self.server = None

    def _make_routes(self):
        return [
            (r"/healthz$", HealthzHandler, dict(app=self)),
            (r"/ping$", RequestPingHandler, dict(app=self)),
        ]

    def _sighup_handler(self):
        def sighup_handler(signal_num, frame):
            ioloop = tornado.ioloop.IOLoop.current()
            ioloop.add_callback_from_signal(self.stop)

        return sighup_handler

    def _sigint_handler(self):
        def sigint_handler(signal_num, frame):
            ioloop = tornado.ioloop.IOLoop.current()
            ioloop.add_callback_from_signal(self.stop)

        return sigint_handler

    def _sigterm_handler(self):
        def sigterm_handler(signal_num, frame):
            ioloop = tornado.ioloop.IOLoop.current()
            ioloop.add_callback_from_signal(self.stop)

        return sigterm_handler

    def _sigusr1_handler(self):
        def sigusr1_handler(signal_num, frame):
            # Do nothing by default.
            pass

        return sigusr1_handler

    async def _start_web_app(self):
        logger.info("starting web application at (%s:%s)", self.address, self.port)

        handlers = self._make_routes()
        self.web_app = tornado.web.Application(handlers)
        self.server = tornado.httpserver.HTTPServer(self.web_app, xheaders=False)
        self.server.listen(address=self.address, port=self.port)
        sockets = self.server._sockets.values()

        logger.info("listening to sockets: %s", sockets)

    def start(self):
        # Set up signal handlers.
        signal.signal(signal.SIGHUP, self._sighup_handler())
        signal.signal(signal.SIGINT, self._sigint_handler())
        signal.signal(signal.SIGTERM, self._sigterm_handler())
        signal.signal(signal.SIGUSR1, self._sigusr1_handler())

        ioloop = tornado.ioloop.IOLoop.current()
        ioloop.add_callback(self._start_web_app)
        ioloop.start()

    async def _stop_web_app(self):
        logger.info("stopping web application at (%s:%s)", self.address, self.port)

        self.server.stop()
        await self.server.close_all_connections()

        logger.info("web application stopped")

    async def _stop_ioloop(self):
        await self._stop_web_app()

        ioloop = tornado.ioloop.IOLoop.current()
        ioloop.add_callback(ioloop.stop)

    def stop(self):
        ioloop = tornado.ioloop.IOLoop.current()
        ioloop.add_callback(self._stop_ioloop)
