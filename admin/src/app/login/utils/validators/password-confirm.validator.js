export const PasswordConfirmValidator = (group) => {
    const password1 = group.get("password");
    const password2 = group.get("passwordConfirm");
    return password1 && password2 && password1.value !== password2.value
        ? { notEqual: "Mots de passe différents" }
        : null;
};
//# sourceMappingURL=password-confirm.validator.js.map