import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface GatewayRole extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
  color: string;
  active: boolean;
}

export const gatewayRoleFactory = (): GatewayRole => ({
  id: null,
  name: "",
  description: "",
  color: "",
  active: true,
  ...new ArchiveInfo(),
});
