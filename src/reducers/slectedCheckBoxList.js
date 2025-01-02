const initialState = [];
//payload={projrctNumber:"",orderNumber:"",flag: "add"}
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_SLECTEDCHECKBOXLIST":
      const { flag, orderNumber } = payload;
      const newStateSet = new Set(state.slice(0));
      const newState = Array.from(newStateSet);
      if (flag) {
        newState.push(orderNumber);
      } else {
        newState.splice(newState.indexOf(orderNumber), 1);
      }
      return newState;
    case "CLEAN_SLECTEDCHECKBOXLIST":
      return [];
    default:
      return state;
  }
};
