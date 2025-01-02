const initialState = JSON.parse(window.localStorage.getItem("auth"));

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_AUTH":
      return payload;
    default:
      return state;
  }
};
