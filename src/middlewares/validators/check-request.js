// @ts-check
import { decodeAccess, parseBearer } from "@dwtechs/toker-express";
import applyAclConditions from "../mappers/apply-acl-conditions.js";
import checkAcl from "./check-acl.js";
import checkConsumer from "./check-consumer.js";

// middleware sub-stacks
export const checkRequest = [
	parseBearer, // Extracts Bearer token from Authorization header
	decodeAccess, // Decodes and verifies JWT access token
	checkConsumer, // Retrieves consumer session from cache
	checkAcl, // Validates user access control permissions
	applyAclConditions, // Injects ACL conditions into req.body.filters
];
