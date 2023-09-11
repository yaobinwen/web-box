import argparse
import logging
import pathlib

from tornado_box.subcmds.srv_pub_sub_long_poll import subcmd_srv_pub_sub_long_poll
from tornado_box.subcmds.srv_request_details import subcmd_srv_request_details
from tornado_box.subcmds.srv_timeout_callback import subcmd_srv_timeout_callback


logger = logging.getLogger(pathlib.Path(__file__).name)


def _syntax():
    parser = argparse.ArgumentParser(description="Tornado Box")

    g = parser.add_argument_group("HTTP options")
    g.add_argument(
        "--address",
        default="*",
        metavar="ADDRESS",
        type=str,
        help=("address to listen incoming HTTP connections " "(default: %(default)s)"),
    )
    g.add_argument(
        "--port",
        default=37361,
        metavar="PORT",
        type=int,
        help=("port to listen incoming HTTP connections " "(default: %(default)s)"),
    )

    subcmds = parser.add_subparsers(
        description="available subcommands",
        dest="subcmd",
    )

    # srv-pub-sub-long-poll
    desc = "A server that implements publish/subscribe pattern using long polling"
    subcmd = subcmds.add_parser("srv-pub-sub-long-poll", description=desc)
    subcmd.set_defaults(func=subcmd_srv_pub_sub_long_poll)

    # srv-request-details
    desc = "A server that helps understand the HTTP request details"
    subcmd = subcmds.add_parser("srv-request-details", description=desc)
    subcmd.set_defaults(func=subcmd_srv_request_details)

    # srv-timeout-callback
    desc = "A server that demonstrates IOLoop.add_timeout"
    subcmd = subcmds.add_parser("srv-timeout-callback", description=desc)
    subcmd.set_defaults(func=subcmd_srv_timeout_callback)
    subcmd.add_argument(
        "--timeout-s",
        default=30,
        type=int,
        help="delay (in seconds) to start the HTTP server (default: %(default)s)",
    )

    return parser


def entrypoint():
    """console_scripts entrypoint."""
    logging.basicConfig(level=logging.DEBUG)

    kwargs = _syntax().parse_args()
    logger.info("subcmd: %s", kwargs)
    func = kwargs.func
    subcmd = kwargs.subcmd
    del kwargs.func
    del kwargs.subcmd
    func(**vars(kwargs))


if __name__ == "__main__":
    entrypoint()
