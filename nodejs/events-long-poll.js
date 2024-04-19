#!/usr/bin/nodejs

import axios from "axios";

import { Command } from "commander";

const syntax = new Command();
syntax
  .usage("[OPTIONS]")
  .option("--api-root <URL>", "The root HTTP endpoint", "http://localhost")
  .parse(process.argv);

const options = syntax.opts();

let pollCounter = 0;
let pollTimeout = null;
const pollEvents = async () => {
  pollCounter += 1;
  console.debug(`polling events (count: ${pollCounter})...`);

  const url = `${options.apiRoot}/tornado-box/events/poll?timeout-in-s=3`;
  const h = {
    Accept: "application/json",
  };

  const _pollEventsOnce = async () => {
    const response = await axios.get(url, { headers: h });
    return response;
  };

  try {
    const response = await _pollEventsOnce();
    console.log(`${response.status} (${response.statusText})`);
  } catch (error) {
    console.error(`${error.response.status} (${error.response.statusText})`);
  } finally {
    if (pollCounter < 10) {
      pollTimeout = setTimeout(pollEvents, 0);
    }
  }
};

pollEvents();
