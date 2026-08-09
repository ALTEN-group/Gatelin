// Pipe to return the error label from an error code

import { Pipe, PipeTransform } from "@angular/core";

const codes = {
  "401": "Authentification requise",
  "403": "Accès interdit",
  "404": "Page introuvable",
  "500": "Erreur serveur",
};

@Pipe({
  name: "errorTranslate",
})
export class ErrorTranslatePipe implements PipeTransform {
  public transform(code: keyof typeof codes): string {
    return codes[code];
  }
}
