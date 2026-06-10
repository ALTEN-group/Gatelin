import { inject } from "@angular/core";
import { GatewayRolesService } from "app/admin/data-access/roles/roles.service";
export const gatewayRolesResolver = (_route, _state) => {
    const service = inject(GatewayRolesService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=roles.resolver.js.map