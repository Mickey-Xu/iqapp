import * as action from "actions";
import * as api from "api";
import * as repo from "js/fetch";
import { saveTheFirstRefreshTime } from "js/util";

export const setAuth = (auth) => {
  return { type: "SET_AUTH", payload: auth };
};

export const clearState = () => {
  return { type: "USER_LOGOUT" };
};

export const login = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .login(data)
    .then((response) => {
      const { result } = response.data;
      if (result === 2) {
        return Promise.reject({ message: "用户名或密码错误" });
      }
      return repo.fetchProfile();
    })
    .then((data) => {
      if (data.isPwdInit) {
        return data;
      } else {
        dispatch(action.setAuth(data));
        window.localStorage.setItem("auth", JSON.stringify(data));
        saveTheFirstRefreshTime(dispatch);
        dispatch(action.setHistoryPage("loginPage"));
        return repo.fetchInstMethods();
      }
    })
    .catch((error) => {
      window.localStorage.removeItem("auth");
      dispatch(action.setAuth(null));
      dispatch(action.setError(error.message));
    })
    .finally(() => {
      dispatch(action.hideLoading());
    });
};

export const logout = () => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .logout()
    .then(() => {
      window.localStorage.removeItem("auth");
      dispatch(setAuth(null));
      dispatch(clearState());
    })
    .catch((error) => {
      dispatch(action.setError(error));
    })
    .finally(() => {
      dispatch(action.hideLoading());
    });
};
