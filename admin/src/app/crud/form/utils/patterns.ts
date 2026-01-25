/** ALPHABETICAL */

const alphabeticalCaracters = "a-zA-Zàâçéèêëîïôûùüÿñæœ'";
export const nameWithDashes = {
	pattern: `^[${alphabeticalCaracters} —-]+$`,
	message: $localize`:@@Shared_NameWithDashes:Caractères autorisés : lettres, espaces et tirets`,
};

export const lettersWithSpaces = {
	pattern: `^[${alphabeticalCaracters} ]+$`,
	message: $localize`:@@Shared_LettersWithSpaces:Caractères autorisés : lettres et espaces`,
};

export const lettersWithoutSpaces = {
	pattern: `^[${alphabeticalCaracters}]+$`,
	message: $localize`:@@Shared_LettersWithoutSpaces:Caractères autorisés : lettres`,
};

/** ALPHANUMERICAL */

export const alphanumericalWithSpaces = {
	pattern: /^[\p{L}0-9 ]+$/u,
	message: $localize`:@@Shared_AlphanumericalWithSpaces:Caractères autorisés : lettres, chiffres et espaces`,
};

export const alphanumericalWithoutSpaces = {
	pattern: /^[\p{L}0-9]+$/u,
	message: $localize`:@@Shared_AlphanumericalWithSpaces:Caractères autorisés : lettres et chiffres`,
};

export const onlyCaps = {
	pattern: /^[A-Z0-9]+$/,
	message: $localize`:@@Shared_OnlyCaps:Caractères autorisés : majuscules et chiffres`,
};

/** NUMERICAL */

export const integer = {
	pattern: /^[0-9]+$/,
	message: $localize`:@@Shared_IntegerOrDecimal:Un nombre entier est requis`,
};

/** OTHERS */
export const phoneNumber = {
	pattern:
		/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
	message: $localize`:@@Shared_PhoneNumber:Format de numéro de téléphone non valide`,
};

export const withExtension = {
	pattern: /[^\\]*\.(\w+)$/,
	message: $localize`:@@Shared_WithExtension:L'extension du fichier est obligatoire`,
};
