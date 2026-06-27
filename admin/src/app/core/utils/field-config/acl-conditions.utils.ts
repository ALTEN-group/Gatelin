import { Acls } from "@core/acl/acls.model";
import {
  ConditionFn,
  ControlOptionsCondition,
  StrictCrudItemOptions,
} from "@dwtechs/crud-builder";

function getFormMode(model: { id: unknown }): "create" | "update" {
  return model.id ? "update" : "create";
}

/**
 * Determines whether a form field should be disabled based on the current ACL policy.
 *
 * A field is disabled when all three conditions are met:
 * - ACLs are defined for the current form mode (`create` / `update`),
 * - the ACL `fields` allowlist is non-empty (an empty list means all fields are permitted),
 * - the field is **absent** from that allowlist.
 *
 * @param field - The field key to evaluate.
 * @param model - The current entity instance (used to derive the form mode).
 * @param acls  - The ACL object for this entity, or `undefined` when not yet loaded.
 * @returns `true` if the field should be disabled, `false` otherwise.
 */
function isFieldDisabled<T extends { id: unknown }>({
  field,
  model,
  acls,
}: {
  field: keyof T;
  model: T;
  acls: Acls | undefined;
}): boolean {
  if (!acls) return false;
  const allowedFields = acls[getFormMode(model)]?.fields ?? [];
  return allowedFields.length > 0 && !allowedFields.includes(field as string);
}

/**
 * Post-processes a column config array by injecting an ACL-based `disabled`
 * condition on every column, with the following rules:
 *
 * - Columns with a **static** `controlOptions.disabled === true` are left untouched
 *   (they are unconditionally disabled regardless of ACLs).
 * - Columns that already have a **dynamic** `conditions.controlOptions.disabled`
 *   function get an OR-composed condition: the field is disabled if the original
 *   condition returns `true` **or** if ACLs disallow it.
 * - All other columns receive a plain ACL condition.
 *
 * @param columns - The column definitions to enrich.
 * @param acls    - The ACL object for this entity, or `undefined` when not yet loaded.
 * @returns A new array of column definitions with ACL conditions applied.
 */
export function withAclConditions<T extends { id: unknown }>(
  columns: StrictCrudItemOptions<T>[],
  acls: Acls | undefined,
): StrictCrudItemOptions<T>[] {
  return columns.map((col) => {
    // Static disabled — ACL condition is irrelevant, keep as-is.
    if (col.controlOptions?.disabled === true) return col;

    const existingDisabled = (
      col.conditions?.controlOptions as ControlOptionsCondition
    )?.disabled as ConditionFn<T> | undefined;

    const aclDisabled: ConditionFn<T> = ({ model }) =>
      isFieldDisabled({ field: col.key as keyof T, model, acls });

    const disabled: ConditionFn<T> = existingDisabled
      ? ({ control, model }) =>
          existingDisabled({ control, model }) ||
          aclDisabled({ control, model })
      : aclDisabled;

    return {
      ...col,
      conditions: {
        ...col.conditions,
        controlOptions: {
          ...col.conditions?.controlOptions,
          disabled,
        },
      },
    };
  });
}
