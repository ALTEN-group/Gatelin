// @ts-check
import oEnt from "../entities/operation.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

export default {
  deleteArchived: makeDeleteArchived(oEnt),
};
