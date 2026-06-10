export function interpolate(string, values) {
    return string.replace(/\{([^}]+)\}/g, (_, v) => {
        const valueProp = v;
        const value = values[valueProp] ?? "";
        return value.toString();
    });
}
//# sourceMappingURL=strings.utils.js.map