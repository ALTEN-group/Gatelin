// @ts-check
import sEnt from "../entities/service.js";
import { makeDeleteArchived } from "../utils/delete-archived.js";

export default {
	deleteArchived: makeDeleteArchived(sEnt),
};
