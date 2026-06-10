/**
 * Get a list of SelectItems from a list of item
 * @param items list of item to map
 * @param keyoflabel key of the label property
 * @returns a list of select item
 */
export function toSelectItems(items, keyoflabel, extraKeys) {
    return (items ?? [])
        .map((item) => ({
        value: item.id,
        label: item[keyoflabel],
        extraData: extraKeys?.reduce((acc, key) => {
            acc[key] = item[key];
            return acc;
        }, {}),
    }))
        .toSorted((a, b) => a.label?.localeCompare(b.label ?? "") ?? 0);
}
export function toNamesSelectOptions(items) {
    return items
        .map((item) => ({
        label: item.name,
        value: item.name,
    }))
        .toSorted((a, b) => a.label?.localeCompare(b.label ?? "") ?? 0);
}
//# sourceMappingURL=to-select-items.js.map