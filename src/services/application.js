// @ts-check
import aEnt from "../entities/application.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

export default {
  deleteArchived: makeDeleteArchived(aEnt),
};
