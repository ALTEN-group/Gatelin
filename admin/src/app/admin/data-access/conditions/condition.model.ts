import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Condition extends ArchiveInfo {
  id: number | null;
  name: string;
  fieldId: number | null;
  fieldName: string;
  op: string;
  value: string;
  color: string | null;
}

export const conditionFactory = (): Condition => ({
  id: null,
  name: "",
  fieldId: null,
  fieldName: "",
  op: "",
  value: "",
  color: null,
  ...new ArchiveInfo(),
});
