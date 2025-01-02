import * as action from "actions";
import * as repo from "js/fetch";
import * as installationStep from "js/installationStep";
import { getDocumentListParmas } from "js/util";
import { db } from "js/db";

let projectNos = [];

export const fetchAll = (type) => (dispatch) => {
  dispatch(action.showLoading());
  return repo
    .fetchMasterData(type)
    .then((data) => {
      let projects = data.workCenters ? Object.keys(data.workCenters) : [];
      data = installationStep.updateInstallationStepDesc(data);
      dispatch(action.setEntities(data));

      return repo.fetchOrdersDataByProjects(type, projects, 1);
      // return repo.fetchOrdersData(type);
    })
    .then((data) => {
      data = installationStep.addActivityStepEditable(data);
      data = installationStep.nineStepsToFourteen(data);
      dispatch(action.setEntities(data));

      projectNos = Object.keys(data.projects);

      return repo.fetchLocalInstallationStepsConfirmDate({ projectNos }, type);
    })
    .then((data) => {
      dispatch(action.setAllLocalInstallationStepConfirmDate(data));
      const result = getDocumentListParmas(projectNos);
      return repo.fetchDocumentList(result, type);
    })
    .then((data) => {
      dispatch(action.setDocuments(data));
      return repo.fetchTemplatesData(type);
    })
    .then((data) => {
      dispatch(action.setTemplates(data));
      return repo.fetchTasks(type);
    })
    .then((data) => {
      dispatch(action.setTasks(data));
    })
    .then(() => {
      return repo.fetchInstMethods(type);
    })
    .then((data) => {
      dispatch(action.setMethods(data));
    })
    .catch((error) => {
      if (error.code === 401) {
        window.localStorage.removeItem("auth");
        dispatch(action.setAuth(null));
      }
      dispatch(action.setError(error.message));
    })
    .finally(() => {
      db.cache.get("dataVersion").then(cache => {
        if (cache?.data === "lastVersion") {
          db.cache.put({ id: "dataVersion", data: "initVersion" })
          window.location.reload()
        }
        dispatch(action.hideLoading());
      })
    });
};
