const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_INSTALLATION_METHOD_DICT":
      return { ...payload };
    default:
      return state;
  }
};
