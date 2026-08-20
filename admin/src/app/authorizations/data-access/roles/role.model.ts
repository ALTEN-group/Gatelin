import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface GatelinRole extends ArchiveInfo {
  id: number | null;
  appId: number | null;
  appName: string;
  name: string;
  description: string;
  color: string;
}

export const gatelinRoleFactory = (): GatelinRole => ({
  id: null,
  appId: null,
  appName: "",
  name: "",
  description: "",
  color: "",
  ...new ArchiveInfo(),
});
