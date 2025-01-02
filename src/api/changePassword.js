import { post } from "./base";

export const changePassword = (data) => {
  return post("/identity/my-profile/change-password", data);
};

export const restNewUserStatus = () => {
  return post("/app/profile/set-password-status");
};
