import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface GatewayRole extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
  colorCode: string;
  active: boolean;
}

export const gatewayRoleFactory = (): GatewayRole => ({
  id: null,
  name: "",
  description: "",
  colorCode: "",
  active: true,
  ...new ArchiveInfo(),
});
