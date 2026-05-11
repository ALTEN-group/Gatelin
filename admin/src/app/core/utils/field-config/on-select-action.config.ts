import { FormFieldInteractionEvent } from "@dwtechs/crud-builder";

export function buildIdNameAction<T extends { id: number | null }>(
  nameKey: string,
  items: T[],
  labelField: keyof T,
) {
  return (event: FormFieldInteractionEvent) => {
    if (event.interactionType !== "valueChange") return;
    const match = items.find((item) => item.id === event.value);
    return [{ key: nameKey, value: match ? match[labelField] : null }];
  };
}

export function buildIdsNamesAction<T extends { id: number | null }>(
  nameKey: string,
  items: T[],
  labelField: keyof T,
) {
  return (event: FormFieldInteractionEvent) => {
    if (event.interactionType !== "valueChange") return;
    const names = (event.value as number[])
      .map((id) => items.find((item) => item.id === id)?.[labelField])
      .filter((n): n is T[keyof T] => n !== undefined);
    return [{ key: nameKey, value: names }];
  };
}
