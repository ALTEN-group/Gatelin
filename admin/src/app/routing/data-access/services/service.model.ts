import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Service extends ArchiveInfo {
  id: number | null;
  name: string;
  pattern: string;
  core: boolean;
}

export const serviceFactory = (): Service => ({
  id: null,
  name: "",
  pattern: "",
  core: false,
  ...new ArchiveInfo(),
});
