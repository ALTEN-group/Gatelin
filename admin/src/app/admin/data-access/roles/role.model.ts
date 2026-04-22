import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface GatewayRole extends ArchiveInfo {
  id: number | null;
  appId: number | null;
  appName: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
}

export const gatewayRoleFactory = (): GatewayRole => ({
  id: null,
  appId: null,
  appName: "",
  name: "",
  description: "",
  color: "",
  active: true,
  ...new ArchiveInfo(),
});
