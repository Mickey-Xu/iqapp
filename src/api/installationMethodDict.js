import { get } from "./base";

export const getInstallationMethodDict = () => {
  return get("/app/installationMethodDict");
};
