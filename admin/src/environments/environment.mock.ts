import { Environment } from "environments/environment.model";

export const environment: Environment = {
  production: false,
  apiGateway: "http://localhost:8100/api/",
  assets: "assets",
  msNotifEnabled: false,
};
