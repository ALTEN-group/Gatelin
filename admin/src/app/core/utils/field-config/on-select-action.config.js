export function buildIdNameAction(nameKey, items, labelField) {
    return (event) => {
        if (event.interactionType !== "valueChange")
            return;
        const match = items.find((item) => item.id === event.value);
        return [{ key: nameKey, value: match ? match[labelField] : null }];
    };
}
export function buildIdsNamesAction(nameKey, items, labelField) {
    return (event) => {
        if (event.interactionType !== "valueChange")
            return;
        const names = event.value
            .map((id) => items.find((item) => item.id === id)?.[labelField])
            .filter((n) => n !== undefined);
        return [{ key: nameKey, value: names }];
    };
}
//# sourceMappingURL=on-select-action.config.js.map