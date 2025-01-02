const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { partnerFunctions } = payload;
      return partnerFunctions ? { ...state, ...partnerFunctions } : state;
    }
    default:
      return state;
  }
};
