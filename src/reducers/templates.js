const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_TEMPLATES": {
      return payload;
    }
    default:
      return state;
  }
};
