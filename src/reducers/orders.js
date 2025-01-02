const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { orders } = payload;
      return orders ? { ...state, ...orders } : state;
    }
    default:
      return state;
  }
};
