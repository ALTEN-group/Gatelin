import { __decorate } from "tslib";
import { Pipe } from "@angular/core";
let GetPermPipe = class GetPermPipe {
    transform(nodeData, roleId) {
        if (nodeData.type !== "route" || roleId === null)
            return undefined;
        return nodeData.rolePerms[roleId];
    }
};
GetPermPipe = __decorate([
    Pipe({
        name: "getPerm",
    })
], GetPermPipe);
export { GetPermPipe };
//# sourceMappingURL=get-perm.pipe.js.map