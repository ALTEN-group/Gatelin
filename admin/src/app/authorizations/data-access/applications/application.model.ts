import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface GatelinApplication extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
  core: boolean;
}

export const gatelinApplicationFactory = (): GatelinApplication => ({
  id: null,
  name: "",
  description: "",
  core: false,
  ...new ArchiveInfo(),
});
