import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { OPERATION_COLUMNS } from "app/admin/data-access/operations/operation.conf";
import {
	Operation,
	operationFactory,
} from "app/admin/data-access/operations/operation.model";

const operationsEndpoint: string = "operations";

@Injectable({
	providedIn: "root",
})
export class OperationsService {
	private readonly crud = new CrudRepository<Operation>().with({
		endpoint: operationsEndpoint,
	});

	public readonly httpCalls: Calls<Operation> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
	};

	public readonly config = OPERATION_COLUMNS;
	public readonly entityFactory = operationFactory;
}
