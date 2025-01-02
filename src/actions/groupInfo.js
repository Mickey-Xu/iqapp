import * as action from "actions";
import * as api from "api";
import { groupInfoProc, groupInfoDeproc } from "js/util";
import { db } from "js/db";

//{projrctNumber, groupName, checkList}
export const initGroupInfo = (value) => ({
  type: "INIT_GROUPINFO",
  payload: value,
});

export const setGroupInfo = (value) => ({
  type: "SET_GROUPINFO",
  payload: value,
});

export const createGroupInfo = (data) => (dispatch) => {
  dispatch(action.showLoading());
  const req = groupInfoDeproc(data);
  return api
    .postGroupInfo(req)
    .then((response) => {
      const data = groupInfoProc(response.data);
      db.cache.put({ id: "groupInfo", data: data }).then(() => {
        dispatch(action.setGroupInfo(data));
      });
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
