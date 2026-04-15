import { Injectable } from "@angular/core";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { COLOR_COLUMNS } from "app/admin/data-access/colors/color.conf";
import {
    Color,
    colorFactory,
} from "app/admin/data-access/colors/color.model";
import { Observable } from "rxjs";

const colorsEndpoint: string = "gateway/colors";

@Injectable({
  providedIn: "root",
})
export class ColorsService {
  private readonly crud = new CrudRepository<Color>().with({
    endpoint: colorsEndpoint,
  });

  public readonly httpCalls: Calls<Color> = {
    get: this.crud.get,
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    history: this.crud.history,
  };

  public readonly config = COLOR_COLUMNS;
  public readonly entityFactory = colorFactory;

  public getAndCacheAll(): Observable<Color[]> {
    return this.crud.getAndCacheAll();
  }
}
