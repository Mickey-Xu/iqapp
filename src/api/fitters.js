import { get, post } from "./base";

export const fetchFittersDemand = (data) => {
  return get("/app/fittersDemand", data);
};

export const fetchFittersCertification = (data) => {
  return get("/app/fittersCertification", data);
};

export const fetchFittersAssignmentTransfer = (data) => {
  return get("/app/fittersAssignmentTransfer", data);
};

export const postFittersAssignmentTransfer = (data) => {
  return post("/app/fittersAssignmentTransfer", data);
};
