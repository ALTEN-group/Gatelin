// @ts-check
import rEnt from "../entities/resource.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

export default {
  deleteArchived: makeDeleteArchived(rEnt),
};
