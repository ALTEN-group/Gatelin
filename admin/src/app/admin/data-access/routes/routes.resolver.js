import { inject } from "@angular/core";
import { RoutesService } from "app/admin/data-access/routes/routes.service";
export const routesResolver = (_route, _state) => {
    const service = inject(RoutesService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=routes.resolver.js.map