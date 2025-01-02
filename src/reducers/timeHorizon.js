const initialState = "all";

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_TIME_HORIZON":
      return payload;
    default:
      return state;
  }
};
