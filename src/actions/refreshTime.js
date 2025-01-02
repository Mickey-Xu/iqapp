import * as action from "actions";
import * as api from "api";
import { db } from "js/db";
import * as schema from "js/schema";
import {
  currentRefreshTime,
  orderActivitiesSort,
  templatesConverter,
  getNonConformityConfig
} from "js/util";
import { normalize } from "normalizr";
import * as repo from "js/fetch";
import store from "js/store";
import { taskDataConversion } from "js/util";

export const setAllDataRefreshTime = (data) => ({
  type: "SET_ALL_DATA_REFRESH_TIME",
  payload: data,
});

const setRequestStatus = (name, loading) => {
  return { type: "SET_REQUEST_STATUS", payload: { name, loading } };
};

export const closeLoading = (name) => setRequestStatus(name, "loaded");

export const openLoading = (name) => setRequestStatus(name, "loading");

export const closeLoadingShowFailInfo = (name) =>
  setRequestStatus(name, "failToLoad");

export const fetchOrders = (request, type, userInfo) => (dispatch) => {
  const auth = JSON.parse(window.localStorage.getItem("auth"));
  let roles = auth?.roles;
  const isSubconTLOrPE = roles.indexOf('Subcon TL') > -1 || roles.indexOf('PE') > -1;
  const isEISV = roles.indexOf('SL') > -1;

  dispatch(action.openLoading("masterData")); //设置loading
  api
    .fetchMasterData(userInfo?.pNumber ? userInfo : {})
    .then((response) => {
      const { entities } = normalize(response.data, schema.masterData);
      entities["nonConformityConfig"] = getNonConformityConfig()
      db.cache.put({ id: "masterData", data: entities }).then(() => {
        db.cache.get("dataRefreshTime").then((cache) => {
          const datatime = cache.data;
          datatime["masterDataRefreshTime"] = currentRefreshTime();
          db.cache.put({ id: "dataRefreshTime", data: datatime }).then(() => {
            dispatch(action.setAllDataRefreshTime(datatime));
          });
        });
      });

      let loaded = true;
      isEISV && dispatch(action.fetchTasksList(request, userInfo, loaded, dispatch)).then((res) => {
        let orders = [...new Set(res.map(item => item.orderNo))]
        fetchOrdersData(request, type, userInfo, entities, orders)
      }) 

      isSubconTLOrPE && fetchOrdersData(request, type, userInfo, entities);

      isSubconTLOrPE && dispatch(action.fetchTasksList(request,userInfo, dispatch));

    })
    .finally(() => {
      db.cache.put({ id: "dataVersion", data: "lastVersion" })
      dispatch(action.closeLoading("masterData"));
    })
    .catch((error) => {
      dispatch(action.closeLoadingShowFailInfo("masterData"));
      dispatch(action.setError(error.message));
      return false;
    });
};

export const fetchDocuments = (request, userInfo) => (dispatch) => {
  dispatch(action.openLoading("document")); //设置loading
  api
    .getDocumentList(request)
    .then((response) => {
      return db.cache
        .put({ id: "documentList", data: response.data })
        .then(() => {
          db.cache.get("dataRefreshTime").then((cache) => {
            const datatime = cache.data;
            datatime["documentListDataRefreshTime"] = currentRefreshTime();
            db.cache.put({ id: "dataRefreshTime", data: datatime }).then(() => {
              dispatch(action.setAllDataRefreshTime(datatime));
            });
          });
        });
    })
    .finally(() => {
      dispatch(action.closeLoading("document"));
    })
    .catch((error) => {
      dispatch(action.closeLoadingShowFailInfo("document"));
      dispatch(action.setError(error.message));
      return false;
    });

  dispatch(action.openLoading("templateList")); //设置loading
  api
    .fetchTemplatesData(userInfo?.pNumber ? userInfo : {})
    .then((response) => {
      const data = templatesConverter(response.data);
      db.cache.put({ id: "templatesData", data: data }).then(() => {
        db.cache.get("dataRefreshTime").then((cache) => {
          const datatime = cache.data;
          datatime["templateListDataRefreshTime"] = currentRefreshTime();
          db.cache.put({ id: "dataRefreshTime", data: datatime }).then(() => {
            dispatch(action.setAllDataRefreshTime(datatime));
          });
        });
      });
    })

    .finally(() => {
      dispatch(action.closeLoading("templateList"));
    })
    .catch((error) => {
      dispatch(action.closeLoadingShowFailInfo("templateList"));
      dispatch(action.setError(error.message));
      return false;
    });
};

export const fetchTasksList = (request, userInfo, loaded) => (dispatch) => {
  dispatch(action.openLoading("taskList")); //设置loading
  const auth = JSON.parse(window.localStorage.getItem("auth"));
  return api
   .fetchIDPTTasks(auth?.userName)
    .then((response) => {
      let resp = response.data?.data.map((item) => {
        return taskDataConversion(item)
     })
      if (auth?.roles.indexOf('SL') > -1 && !loaded) {
        db.cache.get("masterData").then((cache) => {
          let orders = [...new Set(resp.map(item => item.orderNo))]
          fetchOrdersData(request, '', userInfo, cache?.data, orders)
        })
      }

     return db.cache.put({ id: "tasks", data: resp }).then(() => {
       return  db.cache.get("dataRefreshTime").then((cache) => {
          const datatime = cache.data;
          datatime["taskListDataRefreshTime"] = currentRefreshTime();
          db.cache.put({ id: "dataRefreshTime", data: datatime }).then(() => {
            dispatch(action.setAllDataRefreshTime(datatime));
          });
         return resp
        });
      });
    })
    .finally(() => {
      dispatch(action.closeLoading("taskList"));
    })
    .catch((error) => {
      dispatch(action.closeLoadingShowFailInfo("taskList"));
      dispatch(action.setError(error.message));
      return false;
    });
};


export const fetchOrdersData = (request, type, userInfo, entities, orders) => {
  const auth = JSON.parse(window.localStorage.getItem("auth"));
  let roles = auth?.roles;
  const isEISV = roles.indexOf('SL') > -1;
  let projects = entities.workCenters
    ? Object.keys(entities.workCenters)
    : [];
  const dispatch = store.dispatch;
  dispatch(action.openLoading("ordersData"));
  if (isEISV) {
    return api.fetchEISVOrdersData(orders).then((response) => {
      const data = response.data;
      data.orderActivities = orderActivitiesSort(data.orderActivities);
      const { entities } = normalize(data, schema.ordersData);
      return db.cache.put({ id: "ordersData", data: entities }).then(() => { 
        type === "all" &&
          dispatch(action.fetchDocuments(request, userInfo, dispatch));
        return entities     
      })
    }).finally(() => {
        dispatch(action.closeLoading("ordersData"));
    }).catch((error) => {
      dispatch(action.closeLoadingShowFailInfo("ordersData"));
      dispatch(action.setError(error.message));
      return false;
    })
    
  } else {
    api
      .fetchOrdersDataByProjectsAndMerge(projects, 1, userInfo)
      .then((response) => {
        const data = response;
        data.orderActivities = orderActivitiesSort(data.orderActivities);
        const { entities } = normalize(response, schema.ordersData);
        db.cache.put({ id: "ordersData", data: entities }).then(() => {
          const param = { projectNos: projects }
          if (userInfo?.pNumber) {
            param["pNumber"] = userInfo.pNumber
          }
          repo
            .fetchLocalInstallationStepsConfirmDate(param)
            .then(() => {
              db.cache.get("dataRefreshTime").then((cache) => {
                const datatime = cache.data;
                datatime["orderDataRefreshTime"] = currentRefreshTime();
                db.cache
                  .put({ id: "dataRefreshTime", data: datatime })
                  .then(() => {
                    dispatch(action.setAllDataRefreshTime(datatime));
                    type === "all" &&
                      dispatch(action.fetchDocuments(request, userInfo, dispatch));
                  });
              });
            });
        });
      })
      .finally(() => {
        dispatch(action.closeLoading("ordersData"));
      })
      .catch((error) => {
        dispatch(action.closeLoadingShowFailInfo("ordersData"));
        dispatch(action.setError(error.message));
        return false;
      });
  }

}


  

