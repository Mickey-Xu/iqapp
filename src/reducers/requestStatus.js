const initialState = {
  documentStatus: "loaded",
  masterDataStatus: "loaded",
  ordersDataStatus: "loaded",
  templateListStatus: "loaded",
  taskListStatus: "loaded",
};

export default (state = { ...initialState }, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_REQUEST_STATUS": {
      state[payload.name + "Status"] = payload.loading;
      return { ...state };
    }
    default:
      return state;
  }
};
