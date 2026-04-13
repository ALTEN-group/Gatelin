import { ArchiveInfo } from "@altengroup/crud-builder";

export interface Resource extends ArchiveInfo {
  id: number | null;
  serviceId: number | null;
  serviceName: string;
  name: string;
  locked: boolean;
}

export const resourceFactory = (): Resource => ({
  id: null,
  serviceId: null,
  serviceName: "",
  name: "",
  locked: false,
  ...new ArchiveInfo(),
});
