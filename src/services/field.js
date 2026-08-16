// @ts-check
import fEnt from "../entities/field.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

export default {
  deleteArchived: makeDeleteArchived(fEnt),
};
