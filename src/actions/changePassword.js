import * as api from "api";
import * as action from "actions";

export const changePassword = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .changePassword(data)
    .then((response) => {
      //get task
      dispatch(action.hideLoading());
      window.localStorage.removeItem("auth");
      dispatch(action.setAuth(null));
    })
    .catch((error) => {
      if (error.code === 401) {
        window.localStorage.removeItem("auth");
        dispatch(action.setAuth(null));
      }
      dispatch(action.setError(error.message));
    })
    .finally(() => {
      dispatch(action.hideLoading());
    });
};

export const firstLoginRestPassword = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api.changePassword(data).then((res) => {
    return api.restNewUserStatus().then(() => {
      dispatch(action.hideLoading());
      window.localStorage.removeItem("auth");
      dispatch(action.setAuth(null));
    });
  });
};
