const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_OVERDUE_ACTIVITIES":
      return { ...payload };
    default:
      return state;
  }
};
