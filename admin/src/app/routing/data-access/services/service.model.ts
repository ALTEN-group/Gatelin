import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Service extends ArchiveInfo {
  id: number | null;
  name: string;
  pattern: string;
  forwardedCookies: string[];
  core: boolean;
}

export const serviceFactory = (): Service => ({
  id: null,
  name: "",
  pattern: "",
  forwardedCookies: [],
  core: false,
  ...new ArchiveInfo(),
});
