const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { partners } = payload;
      return partners ? { ...state, ...partners } : state;
    }
    default:
      return state;
  }
};
