import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";

/**
 * Represents a consumer (session/authentication entity)
 * Maps to the consumer entity in src/entities/consumer.js
 */
export interface Consumer extends ArchiveInfo {
	id: number | null;
	nickname: string;
	accessToken: string;
	refreshToken: string;
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
	...new ArchiveInfo(),
});
