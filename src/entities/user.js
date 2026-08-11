// @ts-check
import { SQLEntity } from "@dwtechs/antity-pgsql";

// Used to login users via email and password
export default new SQLEntity("user", [
	{
		key: "email",
		type: "email",
		min: 5,
		max: 50,
		isTypeChecked: true,
		isFilterable: true,
		requiredFor: ["POST"],
		operations: [],
		isPrivate: false,
		sanitizer: null,
		normalizer: null,
		validator: null,
	},
	{
		key: "pwd",
		type: "password",
		min: null,
		max: null,
		isTypeChecked: true,
		isFilterable: true,
		requiredFor: ["POST"],
		operations: [],
		isPrivate: false,
		sanitizer: null,
		normalizer: null,
		validator: null,
	},
]);
