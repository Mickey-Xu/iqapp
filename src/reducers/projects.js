const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { projects } = payload;
      return projects ? { ...state, ...projects } : state;
    }
    default:
      return state;
  }
};
