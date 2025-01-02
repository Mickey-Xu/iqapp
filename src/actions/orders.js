import * as action from "actions";
import * as api from "api";
import { db } from "js/db";
import * as repo from "js/fetch";
import * as installationStep from "js/installationStep";
import * as schema from "js/schema";
import { normalize } from "normalizr";

export const updateOrderInstallationsMethod = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .updateOrderInstallationsMethod(data)
    .then((response) => {
      const { entities } = normalize(response.data, [
        schema.orderInstallationMethod,
      ]);
      dispatch(action.setEntities(entities));

      db.cache.get("ordersData").then((cache) => {
        const selectValue = {};
        selectValue[data.orderNumbers] = {
          orderNumbers: data.orderNumbers[0],
          installationMethod: Number(data.installationMethod),
        };
        const datas = {
          ...cache.data.orderInstallationMethods,
          ...selectValue,
        };
        db.cache.put({
          id: "ordersData",
          data: { ...cache.data, ...{ orderInstallationMethods: datas } },
        });
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

/* data = {
    "projectNo": "string",
    "orderNo": "string",
    "activityNo": "string",
    "type": 1,      // 1  actual date   2  planned date
    "date": "string",  // don't required or set it to "" when unlock or cancel     otherwise set this like "2020-11-23" 
    "combinePdf": true    
  }
*/
export const updateOrderActivityStatus = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .updateOrderActivityStatus(data)
    .then((response) => {
      const { entities } = normalize(response.data, [schema.orderActivity]);

      repo.updateOrderActivities(entities).then(() => {
        let newEntities = installationStep.addActivityStepEditable(entities);
        newEntities = installationStep.activityStatusSetNineStepsToFourteen(
          newEntities
        );
        dispatch(action.setEntities(newEntities));
        db.cache.get("localInstallationStepsConfirmDate").then((cache) => {
          if (cache?.data) {
            dispatch(action.setAllLocalInstallationStepConfirmDate(cache.data));
          }
        });
      });

      if (data.type === 1 && data.combinePdf && data.date !== "") {
        db.cache.get("documentList").then((cache) => {
          let V001 = [{ name: `${data.orderNo}_安装检查清单.pdf`, modified: new Date().toISOString().substring(0, 16) }];
          cache.data[data.projectNo][data.orderNo]["V001"] = V001
          db.cache.put({ id: "documentList", data: cache.data })
        });
      }

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

export const setMethods = (data) => ({
  type: "SET_METHODS",
  payload: data,
});

export const updateLocalInstallationStepConfirmDate = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .updateLocalInstallationStepConfirmDate(data)
    .then((response) => {
      const data = response.data;
      if (data.confirmedDate === "0001-01-01T00:00:00") {
        data.confirmedDate = null;
      }

      repo.updateLocalInstallationStepConfirmDate(data).then(() => {
        dispatch(action.setLocalInstallationStepConfirmDate(data));
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

export const setLocalInstallationStepConfirmDate = (data) => ({
  type: "SET_LOCAL_INSTALLATION_STEP_CONFIRMDATE",
  payload: data,
});

export const setAllLocalInstallationStepConfirmDate = (data) => ({
  type: "SET_ALL_LOCAL_INSTALLATION_STEP_CONFIRMDATE",
  payload: data,
});
