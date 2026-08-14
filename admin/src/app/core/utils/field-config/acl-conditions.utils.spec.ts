import { FormControl } from "@angular/forms";
import { Acls } from "@core/acl/acls.model";
import { withAclConditions } from "./acl-conditions.utils";

function column(key: string, overrides: Record<string, unknown> = {}) {
  return { key, ...overrides };
}

function getDisabled(col: unknown) {
  const conditions = (col as { conditions?: { controlOptions?: { disabled?: unknown } } })
    .conditions;
  return conditions?.controlOptions?.disabled as
    | ((args: { model: { id: unknown }; control?: FormControl }) => boolean)
    | undefined;
}

describe("withAclConditions", () => {
  const createAcls = (fields: string[]): Acls =>
    ({
      create: { allowed: true, operations: [], fields },
      update: { allowed: true, operations: [], fields },
    }) as Acls;

  it("leaves statically disabled columns unchanged", () => {
    const col = column("name", {
      controlOptions: { disabled: true },
    });

    const [result] = withAclConditions([col] as never, createAcls(["email"]));
    expect(result).toBe(col);
  });

  it("does not disable fields when ACLs are undefined", () => {
    const [result] = withAclConditions([column("name")] as never, undefined);
    expect(getDisabled(result)?.({ model: { id: null } })).toBe(false);
  });

  it("keeps all fields enabled when the allowlist is empty", () => {
    const [result] = withAclConditions(
      [column("name")] as never,
      createAcls([]),
    );
    expect(getDisabled(result)?.({ model: { id: null } })).toBe(false);
  });

  it("disables fields absent from a non-empty allowlist", () => {
    const [nameCol, emailCol] = withAclConditions(
      [column("name"), column("email")] as never,
      createAcls(["email"]),
    );

    expect(getDisabled(nameCol)?.({ model: { id: null } })).toBe(true);
    expect(getDisabled(emailCol)?.({ model: { id: null } })).toBe(false);
  });

  it("uses update ACLs when the model has an id", () => {
    const acls = {
      create: { allowed: true, operations: [], fields: ["name"] },
      update: { allowed: true, operations: [], fields: ["email"] },
    } as Acls;
    const [result] = withAclConditions([column("name")] as never, acls);

    expect(getDisabled(result)?.({ model: { id: 1 } })).toBe(true);
    expect(getDisabled(result)?.({ model: { id: null } })).toBe(false);
  });

  it("OR-composes with an existing dynamic disabled condition", () => {
    const existingDisabled = vi.fn().mockReturnValue(false);
    const [result] = withAclConditions(
      [
        column("name", {
          conditions: {
            controlOptions: { disabled: existingDisabled },
          },
        }),
      ] as never,
      createAcls(["email"]),
    );
    const model = { id: null };
    const control = new FormControl();

    expect(getDisabled(result)?.({ control, model })).toBe(true);
    expect(existingDisabled).toHaveBeenCalledWith({ control, model });

    existingDisabled.mockReturnValue(true);
    const [allowed] = withAclConditions(
      [
        column("email", {
          conditions: {
            controlOptions: { disabled: existingDisabled },
          },
        }),
      ] as never,
      createAcls(["email"]),
    );
    expect(getDisabled(allowed)?.({ control, model })).toBe(true);
  });
});
