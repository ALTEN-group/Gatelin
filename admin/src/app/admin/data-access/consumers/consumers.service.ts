import { Injectable } from "@angular/core";
import { ConfBuilderPayload } from "@crud/core/models/conf-builder-payload.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { CONSUMER_COLUMNS } from "app/admin/data-access/consumers/consumer.conf";
import {
	Consumer,
	consumerFactory,
} from "app/admin/data-access/consumers/consumer.model";

const consumersApi: string = "gatelin/consumers";

/**
 * Service to manage API consumers
 */
@Injectable({
	providedIn: "root",
})
export class ConsumersService {
	private readonly crud = new CrudRepository<Consumer>().with({
		endpoint: consumersApi,
	});

	public readonly httpCalls: Calls<Consumer> = {
		get: this.crud.get,
		create: this.crud.create,
		update: this.crud.update,
		archive: this.crud.archive,
	};

	public readonly config = (payload: ConfBuilderPayload) =>
		CONSUMER_COLUMNS(payload);
	public readonly entityFactory = consumerFactory;
}
