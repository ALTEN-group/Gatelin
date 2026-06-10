import { __decorate } from "tslib";
import { inject, Pipe } from "@angular/core";
import { AclService } from "@core/acl/acl.service";
let ProtectFeaturePipe = class ProtectFeaturePipe {
    constructor() {
        this.aclService = inject(AclService);
    }
    transform(functionalityKey, operation) {
        return this.aclService.hasAccess(functionalityKey, operation);
    }
};
ProtectFeaturePipe = __decorate([
    Pipe({
        name: "hasAccess",
    })
], ProtectFeaturePipe);
export { ProtectFeaturePipe };
//# sourceMappingURL=protect-feature.pipe.js.map