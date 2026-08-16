// @ts-check
import cEnt from "../entities/condition.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

export default {
  deleteArchived: makeDeleteArchived(cEnt),
};
