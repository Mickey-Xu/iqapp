import activities from "reducers/activities";
import alert from "reducers/alert";
import auth from "reducers/auth";
import documentList from "reducers/documentList";
import fittersAssignmentTransfer from "reducers/fittersAssignmentTransfer";
import fittersCertification from "reducers/fittersCertification";
import fittersDemand from "reducers/fittersDemand";
import formData from "reducers/formData";
import groupInfo from "reducers/groupInfo";
import installationMethodDict from "reducers/installationMethodDict";
import installations from "reducers/installations";
import loading from "reducers/loading";
import orderActivities from "reducers/orderActivities";
import orderInstallationMethods from "reducers/orderInstallationMethods";
import orders from "reducers/orders";
import overdueActivities from "reducers/overdueActivities";
import partnerFunctions from "reducers/partnerFunctions";
import partners from "reducers/partners";
import productFamilies from "reducers/productFamilies";
import projectFilterValue from "reducers/projectFilterValue";
import projects from "reducers/projects";
import refreshTime from "reducers/refreshTime";
import requestStatus from "reducers/requestStatus";
import selectBale from "reducers/selectBale";
import settings from "reducers/settings";
import slectedCheckBoxList from "reducers/slectedCheckBoxList";
import tasks from "reducers/tasks";
import templateForm from "reducers/templateForm";
import templates from "reducers/templates";
import timeHorizon from "reducers/timeHorizon";
import versionUpdating from "reducers/versionUpdating";
import wayToInstallList from "reducers/wayToInstallList";
import scrollPosition from "reducers/scrollPosition";
import nonConformityConfig from "reducers/nonConformityConfig";

import chars from "reducers/chars";
import { combineReducers } from "redux";

const appReducer = combineReducers({
  activities,
  alert,
  auth,
  documentList,
  formData,
  groupInfo,
  installations,
  requestStatus,
  loading,
  orderActivities,
  orderInstallationMethods,
  orders,
  overdueActivities,
  projects,
  productFamilies,
  partners,
  partnerFunctions,
  projectFilterValue,
  selectBale,
  slectedCheckBoxList,
  settings,
  timeHorizon,
  templates,
  templateForm,
  fittersDemand,
  fittersCertification,
  fittersAssignmentTransfer,
  installationMethodDict,
  refreshTime,
  tasks,
  chars,
  versionUpdating,
  wayToInstallList,
  scrollPosition,
  nonConformityConfig
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  if (action.type === "INIT_STORE") {
    state = {};
  }

  return appReducer(state, action);
};

export default rootReducer;
