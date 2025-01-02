import * as api from "api";
import { createDb, db } from "js/db";
import * as schema from "js/schema";
import store from "js/store";
import {
  fittersAssignmentTransferProc,
  groupInfoProc,
  orderActivitiesSort,
  templatesConverter,
  localInstallationStepsConfirmDateProc,
  getNonConformityConfig
} from "js/util";
import { normalize } from "normalizr";
import _ from "lodash";
import { taskDataConversion } from "./util";

export const type = {
  CACHE: 0,
  API: 1,
};

export const initDB = () => {
  const state = store.getState();
  const personalNumber = state.auth.personalNumber;
  createDb(personalNumber);
};

export const fetchProfile = (param = type.API) => {
  if (param === type.API) {
    return api.getProfile().then((response) => {
      createDb(response.data.personalNumber);
      return db.cache.put({ id: "auth", data: response.data }).then(() => {
        return Promise.resolve(response.data);
      });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("auth").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchProfile();
      }
    });
  }
};

export const fetchMasterData = (param = type.API) => {
  if (param === type.API) {
    return api.fetchMasterData().then((response) => {
      const { entities } = normalize(response.data, schema.masterData);
      entities["nonConformityConfig"] = getNonConformityConfig();
      return db.cache.put({ id: "masterData", data: entities }).then(() => {
        return Promise.resolve(entities);
      });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("masterData").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchMasterData();
      }
    });
  }
};

export const fetchOrdersData = (param = type.API) => {
  if (param === type.API) {
    return api.fetchOrdersData().then((response) => {
      const data = response.data;
      data.orderActivities = orderActivitiesSort(data.orderActivities);
      const { entities } = normalize(response.data, schema.ordersData);
      return db.cache.put({ id: "ordersData", data: entities }).then(() => {
        return Promise.resolve(entities);
      });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("ordersData").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchOrdersData();
      }
    });
  }
};

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export const fetchOrdersDataByProjects = (param = type.API, projects, step) => {
  const auth = store.getState().auth;

  if (param === type.API) {
    let promises = [];

    let splitCount = Math.ceil(projects.length / step);

    for (let i = 0; i < splitCount; i++) {
      let ps = { projectNos: projects.slice(i * step, (i + 1) * step) };
      promises.push(api.fetchOrdersDataByProjects(ps));
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

        result.orderActivities = orderActivitiesSort(result.orderActivities);
        const { entities } = normalize(result, schema.ordersData);
        return db.cache.put({ id: "ordersData", data: entities }).then(() => {
          return Promise.resolve(entities);
        });
      }
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("ordersData").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchOrdersDataByProjects(type.API, projects, step);
      }
    });
  }
};

export const fetchTemplatesData = (param = type.API) => {
  if (param === type.API) {
    return api.fetchTemplatesData().then((response) => {
      const data = templatesConverter(response.data);
      return db.cache.put({ id: "templatesData", data: data }).then(() => {
        return Promise.resolve(data);
      });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("templatesData").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchTemplatesData();
      }
    });
  }
};

export const fetchGroupInfo = (param = type.API) => {
  if (param === type.API) {
    return api.fetchGroupInfo().then((response) => {
      const data = groupInfoProc(response.data);
      return db.cache.put({ id: "groupInfo", data: data }).then(() => {
        return Promise.resolve(data);
      });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("groupInfo").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchGroupInfo();
      }
    });
  }
};

export const updateOrderActivities = (data) => {
  return db.cache.get("ordersData").then((cache) => {
    if (cache?.data) {
      let { orderActivities } = cache.data;
      orderActivities = { ...orderActivities, ...data.orderActivities };
      const newOrdersData = { ...cache.data };
      newOrdersData.orderActivities = orderActivities;
      return db.cache.put({ id: "ordersData", data: newOrdersData });
    } else {
      return Promise.resolve(data);
    }
  });
};

export const fetchLocalInstallationStepsConfirmDate = (
  data,
  param = type.API
) => {
  if (param === type.API) {
    let promises = [];
    let projects = data.projectNos;
    let step = 70;
    let splitCount = Math.ceil(projects.length / step);

    for (let i = 0; i < splitCount; i++) {
      let ps = { projectNos: projects.slice(i * step, (i + 1) * step) };
      promises.push(api.getLocalInstallationStepConfirmDate(ps));
    }

    if (promises.length === 0) {
      const data = localInstallationStepsConfirmDateProc([]);
      return db.cache
        .put({ id: "localInstallationStepsConfirmDate", data: data })
        .then(() => {
          return Promise.resolve(data);
        });
    }

    return Promise.all(promises).then((response) => {
      let res = [];
      for (let i = 0; i < splitCount; i++) {
        res = res.concat(response[i].data);
      }
      const data = localInstallationStepsConfirmDateProc(res);
      return db.cache
        .put({ id: "localInstallationStepsConfirmDate", data: data })
        .then(() => {
          return Promise.resolve(data);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("localInstallationStepsConfirmDate").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchLocalInstallationStepsConfirmDate(data);
      }
    });
  }
};

export const updateLocalInstallationStepConfirmDate = (data) => {
  return db.cache.get("localInstallationStepsConfirmDate").then((cache) => {
    if (cache?.data) {
      let localInstallationStepsConfirmDates = { ...cache.data };

      localInstallationStepsConfirmDates[data.orderNo + "-" + data.stepNo] =
        data;

      return db.cache.put({
        id: "localInstallationStepsConfirmDate",
        data: localInstallationStepsConfirmDates,
      });
    } else {
      return Promise.resolve(data);
    }
  });
};

export const fetchFittersDemand = (param = type.API) => {
  if (param === type.API) {
    return api.fetchFittersDemand().then((response) => {
      const { entities } = normalize(response.data, schema.fittersDemands);

      return db.cache
        .put({ id: "fittersDemand", data: entities.fittersDemand })
        .then(() => {
          return Promise.resolve(entities.fittersDemand);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("fittersDemand").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchFittersDemand();
      }
    });
  }
};

export const fetchFittersCertification = (param = type.API) => {
  if (param === type.API) {
    return api.fetchFittersCertification().then((response) => {
      const { entities } = normalize(
        response.data,
        schema.fittersCertifications
      );

      return db.cache
        .put({
          id: "fittersCertification",
          data: entities.fittersCertification,
        })
        .then(() => {
          return Promise.resolve(entities.fittersCertification);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("fittersCertification").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchFittersCertification();
      }
    });
  }
};

export const fetchFittersAssignmentTransfer = (param = type.API) => {
  if (param === type.API) {
    return api.fetchFittersAssignmentTransfer().then((response) => {
      const fittersAssignmentTransfer = fittersAssignmentTransferProc(
        response.data
      );

      return db.cache
        .put({
          id: "fittersAssignmentTransfer",
          data: fittersAssignmentTransfer,
        })
        .then(() => {
          return Promise.resolve(fittersAssignmentTransfer);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("fittersAssignmentTransfer").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchFittersAssignmentTransfer();
      }
    });
  }
};

export const updateFittersAssignmentTransfer = (data) => {
  return db.cache.get("fittersAssignmentTransfer").then((cache) => {
    if (cache?.data) {
      let newData = { ...cache.data };
      const extfittersAssignmentTransfer = fittersAssignmentTransferProc(data);
      newData = { ...newData, ...extfittersAssignmentTransfer };
      return db.cache.put({ id: "fittersAssignmentTransfer", data: newData });
    } else {
      return Promise.resolve(data);
    }
  });
};

export const fetchDocumentList = (request, param = type.API) => {
  if (param === type.API) {
    return api.getDocumentList(request).then((response) => {
      return db.cache
        .put({ id: "documentList", data: response.data })
        .then(() => {
          return Promise.resolve(response.data);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("documentList").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchDocumentList(request);
      }
    });
  }
};

export const fetchInstalltionMethodDict = (param = type.API) => {
  if (param === type.API) {
    return api.getInstallationMethodDict().then((response) => {
      return db.cache
        .put({ id: "InstalltionMethodDict", data: response.data })
        .then(() => {
          return Promise.resolve(response.data);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("InstalltionMethodDict").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchInstalltionMethodDict();
      }
    });
  }
};

export const updateDocumentList = (data) => {
  return db.cache.get("documentList").then((cache) => {
    if (cache?.data) {
      const { projectNo, orderNo, activityNo, documentName, modified } = data;
      let newData = { ...cache.data };

      if (!newData[projectNo]) {
        newData[projectNo] = {};
      }

      if (!newData[projectNo][orderNo]) {
        newData[projectNo][orderNo] = {};
      }

      if (!newData[projectNo][orderNo][activityNo]) {
        newData[projectNo][orderNo][activityNo] = [];
      }

      if (
        newData[projectNo][orderNo][activityNo].some(
          (e) => e.name === documentName
        )
      ) {
        newData[projectNo][orderNo][activityNo].forEach((item) => {
          if (item.name === documentName) {
            item.modified = modified;
          }
        });
      } else {
        newData[projectNo][orderNo][activityNo].push({
          name: documentName,
          modified: modified,
        });
      }
      return db.cache.put({ id: "documentList", data: newData });
    } else {
      return Promise.resolve(data);
    }
  });
};

export const removeCachedData = () => {
  db.cache.clear();
};

export const fetchTasks = (param = type.API) => {
  if (param === type.API) {
    const auth = JSON.parse(window.localStorage.getItem("auth"));
  
    return api
      .fetchIDPTTasks(auth.userName)
      .then((response) => {
        let resp = response.data?.data.map((item) => {
          return taskDataConversion(item)
        });

        return db.cache
          .put({
            id: "tasks",
            data: resp,
          })
          .then(() => {
            return Promise.resolve(resp);
          });
      })
  }

  if (param === type.CACHE) {
    return db.cache.get("tasks").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchTasks();
      }
    });
  }
};

export const fetchInstMethods = (param = type.API) => {
  if (param === type.API) {
    return api.getInstMethods().then((response) => {
      return db.cache
        .put({
          id: "instMethods",
          data: response.data,
        })
        .then(() => {
          return Promise.resolve(response.data);
        });
    });
  }

  if (param === type.CACHE) {
    return db.cache.get("instMethods").then((cache) => {
      if (cache?.data) {
        return Promise.resolve(cache.data);
      } else {
        return fetchTasks();
      }
    });
  }
};
