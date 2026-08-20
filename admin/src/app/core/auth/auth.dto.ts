export interface Permission {
  route: number;
  operations: number[];
  fields: string[];
}

export interface LoginDtoIn {
  email: string;
  pwd: string;
}

export interface SessionResponse {
  accessToken: string;
  permissions: Permission[];
}

/** Returned by POST /sessions when mid-login challenges are required (HTTP 202). */
export interface ChallengeRequiredResponse {
  challengeRequired: true;
  kind: string;
  url: string;
}
