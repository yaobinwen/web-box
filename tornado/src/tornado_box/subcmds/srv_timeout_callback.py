import datetime
import logging
import pathlib
import tornado.web

from tornado_box.app_base import AppBase


logger = logging.getLogger(pathlib.Path(__file__).name)


class App(AppBase):
    def __init__(self, *, address, port):
        super().__init__(address=address, port=port)

    async def delay_start(self, timeout_s):
        logger.info("Delaying the start of the server app for %s seconds", timeout_s)

        ioloop = tornado.ioloop.IOLoop.current()
        ioloop.add_timeout(
            deadline=datetime.timedelta(seconds=timeout_s), callback=self.start
        )


def subcmd_srv_timeout_callback(address, port, timeout_s):
    logger.info("subcmd_srv_timeout_callback")

    app = App(address=address, port=port)

    ioloop = tornado.ioloop.IOLoop.current()
    # As Tornado documentation says, "it is not safe to call add_timeout from
    # other threads." Instead, we must "use `add_callback`` to transfer control
    # to the IOLoop's thread, and then call `add_timeout` from there."
    ioloop.add_callback(app.delay_start, timeout_s=timeout_s)
    ioloop.start()
