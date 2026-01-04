// @ts-check
import { parseBearer, decodeAccess } from "@dwtechs/toker-express";
import { getFromCache } from "../cache/consumer.js";

// middleware sub-stacks
export const checkRequest = [
  parseBearer,
  decodeAccess,
  getFromCache,
];
