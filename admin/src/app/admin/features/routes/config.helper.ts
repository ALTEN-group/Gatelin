import { Injectable, inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";

/**
 * Generic helper class to build entity configuration with resolved route data
 */
@Injectable()
export class ConfigHelper<
  TService extends {
    config: (payload: ActivatedRouteSnapshot) => CrudItemOptions[];
  },
> {
  private readonly route = inject(ActivatedRoute);

  /**
   * Get the entity configuration with resolved data from the activated route
   * @param service The service instance that provides the config method
   */
  public getConfig(service: TService) {
    return service.config(this.route.snapshot);
  }
}
