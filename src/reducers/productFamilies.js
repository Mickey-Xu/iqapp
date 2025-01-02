const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { productFamilies } = payload;
      return productFamilies ? { ...state, ...productFamilies } : state;
    }
    default:
      return state;
  }
};
