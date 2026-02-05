import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

/**
 * Represents a consumer (session/authentication entity)
 * Maps to the consumer entity in src/entities/consumer.js
 */
export interface Consumer extends ArchiveInfo {
	/** Unique identifier */
	id: number | null;

	/** User's display name/nickname (3-30 characters) */
	nickname: string;

	/** JWT access token for authentication */
	accessToken: string;

	/** JWT refresh token for renewing access */
	refreshToken: string;

	/** Array of role IDs assigned to this consumer */
	rolesArrayAgg: number[];
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
	updaterId: null,
	updaterName: null,
	updatedAt: null,
	archivedAt: null,
	archived: false,
});
