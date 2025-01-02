const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { orderInstallationMethods } = payload;
      return orderInstallationMethods
        ? { ...state, ...orderInstallationMethods }
        : state;
    }
    default:
      return state;
  }
};
