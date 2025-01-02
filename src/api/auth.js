import { get, post } from "./base";

export const login = (data) => {
  return post("/app/login", data);
};

export const logout = () => {
  return get("/account/logout");
};

export const getProfile = () => {
  return get("/app/profile");
};
