import * as action from "actions";
import { saveDraftToLocal } from "js/util";
import * as api from "../api/index";

export const setTemplates = (data) => ({
  type: "SET_TEMPLATES",
  payload: data,
});

export const setDocuments = (data) => ({
  type: "SET_DOCUMENT_LIST",
  payload: data,
});

export const setPdfList = (data) => ({
  type: "SET_PDF_LIST",
  payload: [data],
});

export const saveDraft = (data, currentParams, extendParams) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .saveDraft(data)
    .then((res) => {
      const result = data.form;

      const { orderNo, activityNo } = data;

      saveDraftToLocal(result, currentParams, {
        ...extendParams,
        orderNo,
        activityNo,
      });
      return res;
    })
    .finally(() => {
      dispatch(action.hideLoading());
    });
};

export const fetchPdf = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .pdfDownLoad(data)
    .then((response) => {
      dispatch(action.hideLoading());
      const pdfurl = `data:application/pdf;base64,${response.data.blob}`;
      return Promise.resolve(pdfurl);
    })
    .catch((error) => {
      if (error.code === 401) {
        dispatch(action.setAuth(null));
        dispatch(action.hideLoading());
      }
    });
};

export const getNoConformityList = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api.getNoConformityList(data).then((response) => {
    dispatch(action.hideLoading());
    return response;
  });
};

export const getDocumentList = (data) => (dispatch) => {
  api.getDocumentList(data).then((response) => {
    dispatch(action.setDocuments(response.data));
  });
};

export const getHistoryList = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api.getHistoryList(data).then((response) => {
    dispatch(action.hideLoading());
    return response;
  });
};

export const closeNonConfirmityItems = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api.closeNonConfirmityItems(data).then((response) => {
    dispatch(action.hideLoading());
    return response;
  });
};

