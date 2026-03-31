import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { FIELD_COLUMNS } from "app/admin/data-access/fields/field.conf";
import { Field, fieldFactory } from "app/admin/data-access/fields/field.model";

const fieldsEndpoint: string = "gateway/fields";

@Injectable({
	providedIn: "root",
})
export class FieldsService {
	private readonly crud = new CrudRepository<Field>().with({
		endpoint: fieldsEndpoint,
	});

	public readonly httpCalls: Calls<Field> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
		restore: this.crud.restore,
		history: this.crud.history,
	};

	public readonly config = (payload: ActivatedRouteSnapshot) =>
		FIELD_COLUMNS(payload);
	public readonly entityFactory = fieldFactory;
}
