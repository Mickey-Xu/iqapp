import * as action from "actions";
import * as api from "api";
import * as repo from "js/fetch";
import { saveDraftToLocal } from "js/util";

export const updateDocumentList = (data) => ({
  type: "UPDATE_DOCUMENT_LIST",
  payload: data,
});

export const uploadDocumentForm = (data, draftData, param) => (dispatch) => {
  dispatch(action.showLoading());
  return savePdf(data, draftData)
    .then((response) => {
      repo.updateDocumentList(response.data).then(() => {
        dispatch(action.updateDocumentList(response.data));
      });
      const { orderNo, form } = draftData;
      const {
        documentNo,
        documentPart,
        activityNo,
        productFamily,
        productLine,
        language,
      } = param;

      saveDraftToLocal(
        form,
        { documentNo, documentPart },
        { orderNo, activityNo, productFamily, productLine, language }
      );
      dispatch(action.removeTemplateFormState(param));
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
      window.history.back(-1);
    });
};

const savePdf = (data, dataDraft) => {
  let promises = [];

  promises.push(api.uploadDocumentForm(data));

  return Promise.all(promises).then((response) => {
    return Promise.resolve(response[0]);
  });
};
