const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { orderActivities } = payload;
      return orderActivities ? { ...state, ...orderActivities } : state;
    }
    case "SET_LOCAL_INSTALLATION_STEP_CONFIRMDATE":
      const { orderNo, stepNo, confirmedDate } = payload;
      state[orderNo + "-" + stepNo].confirmedDate = confirmedDate;
      return { ...state };
    case "SET_ALL_LOCAL_INSTALLATION_STEP_CONFIRMDATE":
      const installationStepConfirmDates = { ...payload };
      Object.keys(installationStepConfirmDates).forEach((orderAcitivity) => {
        if (state[orderAcitivity]) {
          state[orderAcitivity].confirmedDate =
            installationStepConfirmDates[orderAcitivity].confirmedDate;
        }
      });
      return { ...state };
    default:
      return state;
  }
};
