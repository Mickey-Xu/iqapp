const initialState = "";
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_PROJECTFILTERVALUE":
      return payload ? payload : null;
    default:
      return state;
  }
};
