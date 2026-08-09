import { Environment } from "environments/environment.model";

export const environment: Environment = {
  production: false,
  apiGateway: "http://localhost:8100/api/",
  apiUsers: "http://localhost:8100/api/users/",
  assets: "assets",
  msNotifEnabled: false,
};
