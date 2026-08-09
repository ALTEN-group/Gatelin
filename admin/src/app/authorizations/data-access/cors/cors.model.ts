import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Cors extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string | null;
  credentials: boolean;
}

export const corsFactory = (): Cors => ({
  id: null,
  name: "",
  description: null,
  credentials: false,
  ...new ArchiveInfo(),
});
