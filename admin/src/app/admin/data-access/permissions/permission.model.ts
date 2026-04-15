import { ArchiveInfo } from "@dwtechs/crud-builder";

export interface Permission extends ArchiveInfo {
  id: number | null;
  roleId: number | null;
  routeId: number | null;
  routeName: string;
  operationId: number | null;
  operationName: string;
  fields: string[] | null;
}

export const permissionFactory = (
  roleId: number | null = null,
): Permission => ({
  id: null,
  roleId,
  routeId: null,
  routeName: "",
  operationId: null,
  operationName: "",
  fields: null,
  archived: false,
  archivedAt: null,
  updatedAt: null,
  updaterId: null,
  updaterName: null,
  createdAt: null,
  creatorId: null,
  creatorName: null,
});
