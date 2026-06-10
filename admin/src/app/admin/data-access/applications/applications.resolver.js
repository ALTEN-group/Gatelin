import { inject } from "@angular/core";
import { GatewayApplicationsService } from "app/admin/data-access/applications/applications.service";
export const gatewayApplicationsResolver = (_route, _state) => {
    const service = inject(GatewayApplicationsService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=applications.resolver.js.map