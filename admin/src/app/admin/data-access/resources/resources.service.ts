import { Injectable } from "@angular/core";
import { ConfBuilderPayload } from "@crud/core/models/conf-builder-payload.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { RESOURCE_COLUMNS } from "app/admin/data-access/resources/resource.conf";
import { Resource, resourceFactory } from "app/admin/data-access/resources/resource.model";

const resourcesEndpoint: string = "gatelin/resources";

@Injectable({
	providedIn: "root",
})
export class ResourcesService {
	private readonly crud = new CrudRepository<Resource>().with({
		endpoint: resourcesEndpoint,
	});

	public readonly httpCalls: Calls<Resource> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
	};

	public readonly config = (payload: ConfBuilderPayload) =>
		RESOURCE_COLUMNS(payload);
	public readonly entityFactory = resourceFactory;
}
