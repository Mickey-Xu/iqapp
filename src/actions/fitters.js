import * as action from "actions";
import * as api from "api";
import * as repo from "js/fetch";

export const setFittersDemand = (data) => ({
  type: "SET_FITTERS_DEMAND",
  payload: data,
});

export const setFittersCertification = (data) => ({
  type: "SET_FITTERS_CERTIFICATION",
  payload: data,
});

export const setFittersAssignmentTransfer = (data) => ({
  type: "SET_FITTERS_ASSIGNMENT_TRANSFER",
  payload: data,
});

export const updateFittersAssignmentTransfer = (data) => ({
  type: "UPDATE_FITTERS_ASSIGNMENT_TRANSFER",
  payload: data,
});

export const confirmFittersAssignmentList = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .postFittersAssignmentTransfer(data)
    .then((response) => {
      repo.updateFittersAssignmentTransfer(response.data).then(() => {
        dispatch(action.updateFittersAssignmentTransfer(response.data));
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
