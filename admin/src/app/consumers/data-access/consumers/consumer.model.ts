import { ArchiveInfo } from "@dwtechs/ngx-crud-builder";

/**
 * Represents a consumer (session/authentication entity)
 * Maps to the consumer entity in src/entities/consumer.js
 */
export interface Consumer extends ArchiveInfo {
  id: number | null;
  userId: number;
  nickname: string;
  accessToken: string;
  roles: number[];
}

/**
 * Creates a new Consumer entity with default values
 * @returns {Consumer} A new Consumer object with null/default values
 * @example
 * const newConsumer = consumerFactory();
 */
export const consumerFactory = (): Consumer => ({
  id: null,
  userId: 0,
  nickname: "",
  accessToken: "",
  roles: [],
  ...new ArchiveInfo(),
});
