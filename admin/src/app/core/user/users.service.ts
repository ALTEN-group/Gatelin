import { Injectable } from "@angular/core";
import { USERS_TABLE_CONF } from "@core/user/users-table.conf";
import { ConfBuilderPayload } from "@crud/core/models/conf-builder-payload.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { User } from "./user.class";

@Injectable({ providedIn: "root" })
export class UsersService {
  private readonly usersSuffix: string = "users";

  private readonly crud = new CrudRepository<User>().with({
    endpoint: this.usersSuffix,
    fileOperationsConfig: {
      apiSuffix: "portrait",
      filePropertyKey: "portrait",
      // no serializer but maybe in the future?
    },
  });

  public readonly httpCalls: Calls<User> = {
    get: this.crud.get,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: this.crud.getHistory,
    updateFiles: this.crud.updateFiles,
  };

  public readonly factory = () => new User();

  public readonly conf: (
    payload: ConfBuilderPayload,
  ) => StrictCrudItemOptions<User>[] = (payload) => USERS_TABLE_CONF(payload);
}
