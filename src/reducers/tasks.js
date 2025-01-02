const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_TASKS": {
      return payload;
    }
    default:
      return state;
  }
};