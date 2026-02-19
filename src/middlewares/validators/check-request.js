// @ts-check
import { parseBearer, decodeAccess } from "@dwtechs/toker-express";
import checkAcl from "./check-acl.js";
import checkConsumer from "./check-consumer.js";

// middleware sub-stacks
export const checkRequest = [
  parseBearer,   // Extracts Bearer token from Authorization header
  decodeAccess,  // Decodes and verifies JWT access token
  checkConsumer, // Retrieves consumer session from cache
  checkAcl,      // Validates user access control permissions
];
