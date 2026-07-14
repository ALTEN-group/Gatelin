import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Operation extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
  color: string | null;
  core: boolean;
}

export const operationFactory = (): Operation => ({
  id: null,
  name: "",
  description: "",
  color: null,
  core: false,
  ...new ArchiveInfo(),
});
