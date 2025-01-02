export default (state = {}, { type, payload }) => {
  switch (type) {
    case "SET_ALERT":
      return payload;
    default:
      return state;
  }
};
