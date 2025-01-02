const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_SELECT_BALE": {
      state.indexOf(payload) > -1
        ? state.splice(state.indexOf(payload), 1)
        : state.push(payload);
      return payload ? [...state] : null;
    }
    case "SELECT_ALL": {
      state = payload;
      return payload ? state : null;
    }
    case "UN_SELECT_ALL": {
      state = payload;
      return state;
    }
    default:
      return state;
  }
};
