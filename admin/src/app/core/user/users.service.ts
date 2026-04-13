import {
  Calls,
  CrudRepository,
  StrictCrudItemOptions,
} from "@altengroup/crud-builder";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { USERS_TABLE_CONF } from "@core/user/users-table.conf";
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
    history: this.crud.history,
    updateFiles: this.crud.updateFiles,
  };

  public readonly factory = () => new User();

  public readonly conf: (
    payload: ActivatedRouteSnapshot,
  ) => StrictCrudItemOptions<User>[] = (payload) => USERS_TABLE_CONF(payload);
}
