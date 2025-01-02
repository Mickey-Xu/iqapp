const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_FITTERS_CERTIFICATION":
      return { ...payload };
    default:
      return state;
  }
};
