import { environment } from "environments/environment";
import { tap } from "rxjs";
export function debug(description = "debug") {
    if (environment.production) {
        return tap();
    }
    return tap((val) => console.log(description, val));
}
//# sourceMappingURL=debug.js.map