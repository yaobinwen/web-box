import logging
import pathlib

from tornado_box.app_base import AppBase


logger = logging.getLogger(pathlib.Path(__file__).name)


class App(AppBase):
    pass


def subcmd_srv_base(address, port):
    logger.info("subcmd_srv_base")

    app = App(address=address, port=port)
    app.start()
