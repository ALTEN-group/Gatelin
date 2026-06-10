import { ArchiveInfo } from "@dwtechs/crud-builder";
/**
 * Creates a new Consumer entity with default values
 * @returns {Consumer} A new Consumer object with null/default values
 * @example
 * const newConsumer = consumerFactory();
 */
export const consumerFactory = () => ({
    id: null,
    userId: 0,
    nickname: "",
    accessToken: "",
    refreshToken: "",
    roles: [],
    ...new ArchiveInfo(),
});
//# sourceMappingURL=consumer.model.js.map