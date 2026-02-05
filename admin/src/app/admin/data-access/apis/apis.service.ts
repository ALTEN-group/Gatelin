import { Injectable } from "@angular/core";
import { ConfBuilderPayload } from "@crud/core/models/conf-builder-payload.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { API_COLUMNS } from "app/admin/data-access/apis/api.conf";
import { Api, apiFactory } from "app/admin/data-access/apis/api.model";

const apisEndpoint: string = "apis";

@Injectable({
	providedIn: "root",
})
export class ApisService {
	private readonly crud = new CrudRepository<Api>().with({
		endpoint: apisEndpoint,
	});

	public readonly httpCalls: Calls<Api> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
	};

	public readonly config = (payload: ConfBuilderPayload) =>
		API_COLUMNS(payload);
	public readonly entityFactory = apiFactory;
}
