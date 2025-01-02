const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ALL_DATA_REFRESH_TIME": {
      return payload ? { ...payload } : state;
    }
    default:
      return state;
  }
};
