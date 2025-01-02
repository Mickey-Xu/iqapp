const initDate = {};

export default (state = initDate, { type, payload }) => {
  switch (type) {
    case "RESET_FORM_DATA":
      return {};
    case "SET_FORM_DATA":
      return payload;
    default:
      return state;
  }
};
