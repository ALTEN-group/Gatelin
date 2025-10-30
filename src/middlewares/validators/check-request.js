// @ts-check
import { decodeAccess } from "@dwtechs/toker-express";

import checkConsumer from "./check-consumer.js";
import checkRoute from "./check-route.js";

// middleware sub-stacks
export const checkRequest = [
  checkRoute,
  decodeAccess,
  checkConsumer,
  // checkAcl,
  // updateHeaderWithConsumer,
];
