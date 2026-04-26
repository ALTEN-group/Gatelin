import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Permission extends ArchiveInfo {
  id: number | null;
  roleId: number | null;
  routeId: number | null;
  routeName: string;
  operationId: number[] | null;
  operationName: string;
  fields: string[] | null;
  serviceId: number | null;
  serviceName: string | null;
  resourceId: number | null;
  resourceName: string | null;
}

export const permissionFactory = (
  roleId: number | null = null,
): Permission => ({
  id: null,
  roleId,
  routeId: null,
  routeName: "",
  operationId: [],
  operationName: "",
  fields: null,
  serviceId: null,
  serviceName: null,
  resourceId: null,
  resourceName: null,
  ...new ArchiveInfo(),
});
