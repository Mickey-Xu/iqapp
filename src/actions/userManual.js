import * as action from "actions";
import * as api from "api";
import { db } from "js/db";

export const setUserManual = (data) => ({
  type: "SET_USER_MANUAL_LIST",
  payload: data,
});

export const getUserManual = () => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .getUserManual()
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .finally(() => {
      dispatch(action.hideLoading());
    });
};

export const getPdfData = (id) => (dispatch) => {
  dispatch(action.showLoading());

  return db.cache.get("userManualData").then((cache) => {
    if (cache?.data[id]) {
      const pdfurl = `data:application/pdf;base64,${cache?.data[id].blob}`;
      dispatch(action.hideLoading());
      return Promise.resolve(pdfurl);
    } else {
      return api
        .downLoadPdf(id)
        .then((res) => {
          const userManualData = cache?.data || {};
          userManualData[id] = { name: res.data.name, blob: res.data.blob };

          if (cache?.data) {
            return db.cache
              .put({
                id: "userManualData",
                data: userManualData,
              })
              .then(() => {
                const pdfurl = `data:application/pdf;base64,${res.data.blob}`;
                return Promise.resolve(pdfurl);
              });
          } else {
            return db.cache
              .put({
                id: "userManualData",
                data: userManualData,
              })
              .then(() => {
                const pdfurl = `data:application/pdf;base64,${res.data.blob}`;
                return Promise.resolve(pdfurl);
              });
          }
        })
        .finally(() => {
          dispatch(action.hideLoading());
        });
    }
  });
};
