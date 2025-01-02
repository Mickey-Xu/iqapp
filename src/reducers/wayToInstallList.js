const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_METHODS": {
      return payload ? { ...state, ...payload } : state;
    }
    default:
      return state;
  }
};
