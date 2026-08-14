import { SchemaRow } from "@core/schema/schema.service";

export function partitionSchemaFields(rows: SchemaRow[]): {
  create: string[];
  update: string[];
} {
  return rows.reduce(
    (acc, row) => {
      if (row.operations.includes("INSERT")) acc.create.push(row.key);
      if (row.operations.includes("UPDATE")) acc.update.push(row.key);
      return acc;
    },
    { create: [] as string[], update: [] as string[] },
  );
}
