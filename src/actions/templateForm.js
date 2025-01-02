import * as action from "actions";
import * as api from "api";
import { Base64 } from "js-base64";
import { serialize, deserialize } from "js/sfdl";
import { checkTemplateForm, getDraft, getRawTemplate } from "js/util";
import { initFormState } from "js/templateFormUtil";
import store from "js/store";
import moment from "moment";

export const setTemplateFormState = (state) => ({
  type: "SET_TEMPLATE_FORM_STATE",
  payload: state,
});

export const removeTemplateFormState = (data) => ({
  type: "REMOVE_TEMPLATE_FORM_STATE",
  payload: data,
});

export const handleOnChange = (data) => ({
  type: "HANDLE_COMPONENT_VALUE_ONCHANGE",
  payload: data,
});

export const storeCurrentParams = (data) => ({
  type: "STORE_CURRENT_PARAMS",
  payload: data,
});

export const initTemplateForm =
  (
    documentNo,
    documentPart,
    activityNo,
    productFamily,
    productLine,
    language,
    data,
    routeParams
  ) =>
  (dispatch) => {
    const templateForm = {};
    templateForm[
      documentNo +
        "-" +
        documentPart +
        "-" +
        activityNo +
        "-" +
        productFamily +
        "-" +
        productLine +
        "-" +
        language
    ] = initFormState(deserialize(Base64.decode(data)), routeParams);
    dispatch(action.setTemplateFormState(templateForm));
    return Promise.resolve(
      Base64.encode(
        serialize(
          templateForm[
            documentNo +
              "-" +
              documentPart +
              "-" +
              activityNo +
              "-" +
              productFamily +
              "-" +
              productLine +
              "-" +
              language
          ]
        )
      )
    );
  };

/**
 * code: 1: 正常数据 xml的 base64
 *       2: 提示模板有变动，draft 失效
 *       3：draft 不存在
 */
export const fetchTemplateForm =
  (param, draftParam, expendParam) => (dispatch) => {
    dispatch(action.showLoading());
    const { documentNo, documentPart } = param;

    return api
      .fetchTemplateFormData(param)
      .then((response) => {
        const date = moment(response?.["headers"]?.["date"]).format("YYYY-MM-DD")
        dispatch(action.setAuth({ ...store.getState().auth, CurrentDate: date }));
        if (response.code === 0) {
          return getDraft(param, draftParam, expendParam).then((data) => {
            return Promise.resolve(data);
            });
        }
        // 1. check raw base64 string
        return checkTemplateForm(
          documentNo,
          documentPart,
          response.data?.value
        ).then((data) => {
          if (data.code === 3 || data.code === 1) {
            // 接口template和本地template相同 
            // 2. get draft
            return getDraft(param, draftParam, expendParam).then((data) => {
              if (data.code === 2) {
                // 本地和远端草稿不存在
                return getRawTemplate(documentNo, documentPart).then((data) => {
                  return Promise.resolve({ code: 1, value: data });
                });
              } else {
                return Promise.resolve(data);
              }
            });
          } else {
            return Promise.resolve(data);
          }
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
