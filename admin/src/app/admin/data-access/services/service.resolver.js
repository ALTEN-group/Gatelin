import { inject } from "@angular/core";
import { ServicesService } from "app/admin/data-access/services/services.service";
export const serviceResolver = (_route, _state) => {
    const service = inject(ServicesService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=service.resolver.js.map