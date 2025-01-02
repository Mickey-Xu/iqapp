import { get, post } from "./base";

export const fetchGroupInfo = () => {
  return get("/app/groupInfo");
};

export const postGroupInfo = (data) => {
  return post("/app/groupInfo", data);
};
