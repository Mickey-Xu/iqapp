const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_ENTITIES": {
      const { installations } = payload;
      return installations ? { ...state, ...installations } : state;
    }
    default:
      return state;
  }
};
