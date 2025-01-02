const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_SCROLL_POSITION": {
      state[payload.namepath] = payload.position;
      return { ...state };
    }
    default:
      return state;
  }
};
