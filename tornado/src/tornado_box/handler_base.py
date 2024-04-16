import logging
import pathlib
import tornado.web


logger = logging.getLogger(pathlib.Path(__file__).name)


class HandlerBase(tornado.web.RequestHandler):
    def allow_origin_if_needed(self):
        req_origin = self.request.headers.get("Origin")
        if req_origin is None:
            forwarded_for = self.request.headers.get("X-Forwarded-For")
            if forwarded_for:
                # If the request is behind a proxy, we probably don't need to
                # add the "Access-Control-Allow-Origin" header.
                return

            user_agent = self.request.headers.get("User-Agent")
            if "curl" in user_agent.lower():
                # cURL is outside any browser so is free to do anything, so we
                # don't need to add the "Access-Control-Allow-Origin" header.
                return

        host_uri = f"{self.request.protocol}://{self.request.host}"
        logger.debug("request origin: %s", req_origin)
        logger.debug("host URI: %s", host_uri)
        if host_uri != req_origin:
            logger.debug(
                "request origin and host URI are different: "
                + f"adding header 'Access-Control-Allow-Origin: {req_origin}'"
            )
            self.add_header("Access-Control-Allow-Origin", req_origin)
