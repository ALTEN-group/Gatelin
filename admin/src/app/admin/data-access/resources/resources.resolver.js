import { inject } from "@angular/core";
import { ResourcesService } from "app/admin/data-access/resources/resources.service";
export const resourcesResolver = (_route, _state) => {
    const service = inject(ResourcesService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=resources.resolver.js.map