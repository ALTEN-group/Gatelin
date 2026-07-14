import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

export interface Resource extends ArchiveInfo {
  id: number | null;
  serviceId: number | null;
  serviceName: string;
  name: string;
  core: boolean;
}

export const resourceFactory = (): Resource => ({
  id: null,
  serviceId: null,
  serviceName: "",
  name: "",
  core: false,
  ...new ArchiveInfo(),
});
