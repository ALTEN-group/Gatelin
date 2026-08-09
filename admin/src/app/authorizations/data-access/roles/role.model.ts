import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface GatewayRole extends ArchiveInfo {
  id: number | null;
  appId: number | null;
  appName: string;
  name: string;
  description: string;
  color: string;
}

export const gatewayRoleFactory = (): GatewayRole => ({
  id: null,
  appId: null,
  appName: "",
  name: "",
  description: "",
  color: "",
  ...new ArchiveInfo(),
});
