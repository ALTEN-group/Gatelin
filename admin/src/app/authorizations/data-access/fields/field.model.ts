import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Field extends ArchiveInfo {
  id: number | null;
  resourceId: number | null;
  resourceName: string;
  serviceId: number | null;
  serviceName: string;
  name: string;
  core: boolean;
}

export const fieldFactory = (): Field => ({
  id: null,
  resourceId: null,
  resourceName: "",
  serviceId: null,
  serviceName: "",
  name: "",
  core: false,
  ...new ArchiveInfo(),
});
