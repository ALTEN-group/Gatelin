import { ErrorTranslatePipe } from "./error-translate.pipe";

describe("ErrorTranslatePipe", () => {
  const pipe = new ErrorTranslatePipe();

  it.each([
    ["401", "Authentification requise"],
    ["403", "Accès interdit"],
    ["404", "Page introuvable"],
    ["500", "Erreur serveur"],
  ] as const)("maps %s to its French label", (code, label) => {
    expect(pipe.transform(code)).toBe(label);
  });
});
