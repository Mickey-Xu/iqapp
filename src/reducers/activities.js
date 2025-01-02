const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { activities } = payload;
      return activities ? { ...state, ...activities } : state;
    }
    default:
      return state;
  }
};
