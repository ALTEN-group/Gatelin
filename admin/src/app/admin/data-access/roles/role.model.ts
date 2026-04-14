import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

export interface GatewayRole extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
  colorId: number | null;
  colorName: string;
  active: boolean;
}

export const gatewayRoleFactory = (): GatewayRole => ({
  id: null,
  name: "",
  description: "",
  colorId: null,
  colorName: "",
  active: true,
  ...new ArchiveInfo(),
});
