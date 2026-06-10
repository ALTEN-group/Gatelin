import { CrudItemBase } from "@dwtechs/crud-builder";
export class Role extends CrudItemBase {
    constructor() {
        super(...arguments);
        this.name = "";
        this.description = "";
        this.color = "";
        this.level = 0;
        this.permissions = [];
    }
}
// TODO: i would like to store smthg like this instead: { 'users': 'read', 'events': 'write' }
//# sourceMappingURL=role.class.js.map