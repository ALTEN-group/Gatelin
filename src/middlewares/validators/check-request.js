// @ts-check
import { parseBearer, decodeAccess } from "@dwtechs/toker-express";
import { getFromCache } from "../cache/consumer.js";

// middleware sub-stacks
export const checkRequest = [
  parseBearer,   // Extracts Bearer token from Authorization header
  decodeAccess,  // Decodes and verifies JWT access token
  getFromCache,  // Retrieves consumer session from cache
];
