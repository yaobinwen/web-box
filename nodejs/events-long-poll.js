#!/usr/bin/node

import axios from "axios";

import { Command } from "commander";

const syntax = new Command();
syntax
  .usage("[OPTIONS]")
  .option(
    "--api-root <URL>",
    "The root HTTP endpoint",
    "http://localhost:20361"
  )
  .option("--timeout-s <DURATION>", "The polling timeout in seconds", 1)
  .option("--poll-max-count <INTEGER>", "The number of times to poll events", 3)
  .parse(process.argv);

const options = syntax.opts();
console.debug("Options: ", options);

let pollCounter = 0;
const POLL_MAX_COUNT = options.pollMaxCount;
const URL = `${options.apiRoot}/events/poll?timeout-in-s=${options.timeoutS}`;
const HEADERS = { Accept: "application/json" };
const pollEvents = async () => {
  pollCounter += 1;

  const _pollEventsOnce = async () => {
    console.debug(`polling events (count: ${pollCounter}) at ${URL}...`);
    const response = await axios.get(URL, { headers: HEADERS });
    return response;
  };

  try {
    const response = await _pollEventsOnce();
    console.log(`${response.status} (${response.statusText})`);
  } catch (error) {
    console.error(`${error.response.status} (${error.response.statusText})`);
  } finally {
    if (pollCounter < POLL_MAX_COUNT) {
      setTimeout(pollEvents, 0);
    }
  }
};

pollEvents();
