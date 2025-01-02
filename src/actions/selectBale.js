export const selectAll = (orderNumber) => ({
  type: "SELECT_ALL",
  payload: orderNumber,
});

export const unSelectAll = () => ({
  type: "UN_SELECT_ALL",
  payload: [],
});

export const selectBale = (orderNumber) => ({
  type: "SET_SELECT_BALE",
  payload: orderNumber,
});
