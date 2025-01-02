import { changeValue } from "js/templateFormUtil";

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "REMOVE_TEMPLATE_FORM_STATE": {
      const {
        documentNo,
        documentPart,
        activityNo,
        productFamily,
        productLine,
        language,
      } = payload;
      const newState = { ...state };
      delete newState[
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
      ];
      return { ...newState };
    }
    case "SET_TEMPLATE_FORM_STATE": {
      return payload ? { ...state, ...payload } : state;
    }
    case "HANDLE_COMPONENT_VALUE_ONCHANGE": {
      const newState = changeValue(state, payload);
      return { ...newState };
    }
    case "STORE_CURRENT_PARAMS": {
      const currentTemplateParams = { currentTemplateParams: { ...payload } };
      return payload ? { ...state, ...currentTemplateParams } : state;
    }
    default:
      return state;
  }
};
