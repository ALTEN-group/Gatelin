// Pipe to return the error label from an error code
import { __decorate } from "tslib";
import { Pipe } from "@angular/core";
const codes = {
    "401": "Authentification requise",
    "403": "Accès interdit",
    "404": "Page introuvable",
    "500": "Erreur serveur",
};
let ErrorTranslatePipe = class ErrorTranslatePipe {
    transform(code) {
        return codes[code];
    }
};
ErrorTranslatePipe = __decorate([
    Pipe({
        name: "errorTranslate",
    })
], ErrorTranslatePipe);
export { ErrorTranslatePipe };
//# sourceMappingURL=error-translate.pipe.js.map