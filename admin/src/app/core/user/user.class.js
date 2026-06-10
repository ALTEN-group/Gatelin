import { CrudItemBase, INIT_COORDINATES, } from "@dwtechs/crud-builder";
export class User extends CrudItemBase {
    constructor() {
        super(...arguments);
        this.firstName = "";
        this.lastName = "";
        this.nickname = "";
        this.portrait = "";
        this.portrait_files = [];
        this.country = "";
        this.email = "";
        this.phone = "";
        this.token = "";
        this.permissions = [];
        this.active = true;
        /** Address group */
        this.address = INIT_COORDINATES;
        // geo coordinates
        this.location = [0, 0];
        this.street = "";
        this.zipCode = "";
        this.city = "";
        this.label = "";
    }
}
//# sourceMappingURL=user.class.js.map