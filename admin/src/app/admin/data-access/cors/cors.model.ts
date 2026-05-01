import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Cors extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string | null;
}

export const corsFactory = (): Cors => ({
  id: null,
  name: "",
  description: null,
  ...new ArchiveInfo(),
});
