import logging
import pathlib
import tornado.web


logger = logging.getLogger(pathlib.Path(__file__).name)


class HandlerBase(tornado.web.RequestHandler):
    def allow_origin_if_needed(self):
        req_origin = self.request.headers.get("Origin")
        host_uri = f"{self.request.protocol}://{self.request.host}"
        logger.debug("request origin: %s", req_origin)
        logger.debug("host URI: %s", host_uri)

        if req_origin is None:
            return

        if host_uri != req_origin:
            logger.debug(
                "request origin and host URI are different: "
                + f"adding header 'Access-Control-Allow-Origin: {req_origin}'"
            )
            self.add_header("Access-Control-Allow-Origin", req_origin)
