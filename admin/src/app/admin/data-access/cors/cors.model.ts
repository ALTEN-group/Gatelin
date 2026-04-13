import { ArchiveInfo } from "@altengroup/crud-builder";

export interface Cors extends ArchiveInfo {
  id: number | null;
  name: string;
}

export const corsFactory = (): Cors => ({
  id: null,
  name: "",
  ...new ArchiveInfo(),
});
