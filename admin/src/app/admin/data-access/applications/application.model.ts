import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface GatewayApplication extends ArchiveInfo {
  id: number | null;
  name: string;
  description: string;
}

export const gatewayApplicationFactory = (): GatewayApplication => ({
  id: null,
  name: "",
  description: "",
  ...new ArchiveInfo(),
});
