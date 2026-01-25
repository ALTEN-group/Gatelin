import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

/**
 * Represents a consumer (API client)
 */
export interface Consumer extends ArchiveInfo {
  id: number | null;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  rolesArrayAgg: number[];
  creatorId: number | null;
  creatorName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * Creates a new Consumer entity with default values
 * @returns {Consumer} A new Consumer object with null/default values
 * @example
 * const newConsumer = consumerFactory();
 */
export const consumerFactory = (): Consumer => ({
  id: null,
  nickname: "",
  accessToken: "",
  refreshToken: "",
  rolesArrayAgg: [],
  creatorId: null,
  creatorName: null,
  createdAt: null,
  updatedAt: null,
  archivedAt: null,
  archived: false,
});
