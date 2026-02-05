import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { SERVICE_COLUMNS } from "app/admin/data-access/services/service.conf";
import {
	Service,
	serviceFactory,
} from "app/admin/data-access/services/service.model";

const servicesApi: string = "services";

@Injectable({
	providedIn: "root",
})
export class ServicesService {
	private readonly crud = new CrudRepository<Service>().with({
		endpoint: servicesApi,
	});

	public readonly httpCalls: Calls<Service> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
	};

	public readonly config = SERVICE_COLUMNS;
	public readonly entityFactory = serviceFactory;
}
