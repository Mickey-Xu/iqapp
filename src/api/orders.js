import { get, post } from "./base";
import store from "js/store";
import _ from "lodash";

export const fetchMasterData = (data) => {
  return get("/app/orderMDGet", data);
};

export const fetchOrdersData = (data) => {
  return get("/app/ordersGet", data);
};

export const fetchOrdersDataByProjects = (data) => {
  return get("/app/ordersGet/ByProjects", data);
};

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export const fetchOrdersDataByProjectsAndMerge = (projects, step, userInfo) => {
  const auth = store.getState().auth;
  let promises = [];

  let splitCount = Math.ceil(projects.length / step);
  for (let i = 0; i < splitCount; i++) {
    let ps = { projectNos: projects.slice(i * step, (i + 1) * step) };
    if (userInfo?.pNumber) {
      ps["pNumber"] = userInfo.pNumber;
    }
    promises.push(fetchOrdersDataByProjects(ps));
  }

  if (promises.length === 0) {
    // Just get the error message through call api
    const message = auth?.roles[0] === "SL" ? "请到我的->同步界面上，点最右上角的同步按钮同步数据" : "未发现该用户的订单信息";

    return Promise.reject({ message: message });
  }

  let result = {};
  let fulfilledValues = [];

  return Promise.allSettled(promises).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        fulfilledValues.push(result.value);
      }
    });

    if (fulfilledValues.length === 0) {
      const message = auth?.roles[0] === "SL" ? "请到我的->同步界面上，点最右上角的同步按钮同步数据" : "未发现该用户的订单信息";

      return Promise.reject({ message: message });
    } else {
      for (let i = 0; i < fulfilledValues.length; i++) {
        _.mergeWith(result, fulfilledValues[i].data, customizer);
      }

      return Promise.resolve(result);
    }
  });
};

export const updateOrderInstallationsMethod = (data) => {
  return post("/app/orderInstallationMethod", data);
};

export const updateOrderActivityStatus = (data) => {
  return post("/app/activityStatusSet", data);
};

export const getInstMethods = () => {
  return get("/app/instMethods");
};

export const updateLocalInstallationStepConfirmDate = (data) => {
  return post("/app/convertStepsConfirmedDate", data);
};

export const getLocalInstallationStepConfirmDate = (data) => {
  return get("/app/convertStepsConfirmedDate", data);
};

export const checkFileIsExisting = (data) => {
  return post("/app/CheckFileExisting", data);
};
