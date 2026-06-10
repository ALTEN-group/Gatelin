import { inject } from "@angular/core";
import { RolesService } from "@core/roles/roles.service";
export const rolesResolver = (_route, _state) => {
    const service = inject(RolesService);
    return service.getAll();
};
//# sourceMappingURL=roles.resolver.js.map