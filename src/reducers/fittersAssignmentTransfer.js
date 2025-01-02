import { fittersAssignmentTransferProc } from "js/util";

const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_FITTERS_ASSIGNMENT_TRANSFER":
      return { ...payload };
    case "UPDATE_FITTERS_ASSIGNMENT_TRANSFER":
      const newData = fittersAssignmentTransferProc(payload);
      return { ...state, ...newData };
    default:
      return state;
  }
};
