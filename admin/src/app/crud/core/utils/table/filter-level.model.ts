export const FILTER_LEVELS = {
  BASIC: "basic",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type FilterLevel = (typeof FILTER_LEVELS)[keyof typeof FILTER_LEVELS];
