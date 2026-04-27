import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Service extends ArchiveInfo {
  id: number | null;
  appId: number | null;
  appName: string;
  name: string;
  pattern: string;
  core: boolean;
}

export const serviceFactory = (): Service => ({
  id: null,
  appId: null,
  appName: "",
  name: "",
  pattern: "",
  core: false,
  ...new ArchiveInfo(),
});
