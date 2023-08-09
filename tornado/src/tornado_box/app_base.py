import logging
import pathlib
import tornado.web


logger = logging.getLogger(pathlib.Path(__file__).name)


class AppBase(object):
    def __init__(
        self,
        *,
        address,
        port,
    ):
        self.address = address
        self.port = port

        self.app = self.server = None

    def _make_routes(self):
        return []

    async def start(self):
        handlers = self._make_routes()
        self.app = tornado.web.Application(handlers)
        self.server = tornado.httpserver.HTTPServer(self.app, xheaders=False)
        self.server.listen(address=self.address, port=self.port)
        sockets = self.server._sockets.values()
        logger.info("listening to sockets: %s", sockets)
