# Web Box

## Overview

This repository has the notes and code of learning web development, including [React.js](https://react.dev/), [MUI](https://mui.com/), [node.js](https://nodejs.org/en), and [Tornado Web Server](https://www.tornadoweb.org/en/stable/).

| Sub-directory | Purpose                                                                  |
| ------------: | :----------------------------------------------------------------------- |
|        nodejs | The main demonstration code for backend development using Node.js.       |
|       reactjs | The main demonstration code for frontend development (React.js and MUI). |
|       tornado | The main demonstration code for Tornado web server.                      |

Most of the code is self-containing that doesn't depend on any other code to run. However, sometimes I also developed both the frontend and the backend for experiments. See the section "Inter-dependent code" below for more details.

## Sub-directory: nodejs

See `nodejs/README.md` for more details.

## Sub-directory: reactjs

See `reactjs/README.md` for more details.

## Sub-directory: tornado

See `tornado/README.md` for more details.

## Inter-dependent code

### Long-polling demo

I developed the demo code to learn how to implement long polling:

- `tornado`'s `srv_events_long_poll` and `srv_pub_sub_long_poll` implement two backend services that support long polling.
- `nodejs/events-long-poll.js` implements the client that does the "events long poll" (thus should be used together with `srv_events_long_poll`).
- `reactjs`'s `DemoLongPolling.js` implements the client that does both "events long poll" and "pub-sub long poll".
