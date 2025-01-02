const initialState = {
  language: "zh-cn",
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_LANGUAGE": {
      return payload ? { language: payload } : state;
    }
    case "SET_DEFAULT_TAB": {
      return payload ? { ...state, ...{ defaultTab: payload } } : state;
    }
    case "SET_HISTORY_PAGE": {
      return payload ? { ...state, ...{ historyPage: payload } } : state;
    }
    case "SET_TASK_DEFAULT_TAB": {
      return payload ? { ...state, ...{ taskDefaultTab: payload } } : state;
    } 
    default:
      return state;
  }
};
