const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { chars } = payload;
      return chars ? { ...state, ...chars } : state;
    }
    default:
      return state;
  }
};
