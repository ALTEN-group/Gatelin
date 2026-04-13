import { ArchiveInfo } from "@altengroup/crud-builder";

export interface Service extends ArchiveInfo {
  id: number | null;
  name: string;
  pattern: string;
  locked: boolean;
}

export const serviceFactory = (): Service => ({
  id: null,
  name: "",
  pattern: "",
  locked: false,
  ...new ArchiveInfo(),
});
