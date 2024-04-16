import logging
import pathlib
import tornado.web

from tornado_box.app_base import AppBase


logger = logging.getLogger(pathlib.Path(__file__).name)


class RequestDetailsHandler(tornado.web.RequestHandler):
    def initialize(self, *, app):
        self.app = app

    def get(self, arg1, *args, **kwargs):
        print("=" * 100)
        print()
        print(f"arg1: {arg1}")
        print()
        print("self.request overview:")
        print("-" * 20)
        print(self.request)
        print()
        print("self.request.__dict__:")
        print("-" * 20)
        for key, value in self.request.__dict__.items():
            print(f"    {key}: {value}")
        print("=" * 100)

        self.set_status(200)
        self.finish()


class App(AppBase):
    def __init__(self, *, address, port):
        super().__init__(address=address, port=port)

    def _make_routes(self):
        routes = super()._make_routes()
        routes.extend(
            [
                (
                    r"/request/(?P<arg1>[a-zA-Z0-9]+)$",
                    RequestDetailsHandler,
                    dict(app=self),
                )
            ]
        )
        return routes


def subcmd_srv_request_details(address, port):
    logger.info("subcmd_srv_request_details")

    app = App(address=address, port=port)
    ioloop = tornado.ioloop.IOLoop.current()
    ioloop.add_callback(app.start)
    ioloop.start()
