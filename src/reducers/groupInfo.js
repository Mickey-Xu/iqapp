const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "UPDATE_GROUPINFO":
      const { projrctNumber, groupName, checkList } = payload;
      const gropInfo = {};
      const groupItem = {};
      groupItem[groupName] = checkList;
      gropInfo[projrctNumber] = groupItem;
      // gropInfo[projrctNumber][groupIndex] = groupIndex;

      return { ...state, ...gropInfo };
    case "INIT_GROUPINFO":
      const { projectNumber, initOrderList } = payload;
      const initGroupItem = {};
      initGroupItem["UndefinedGroupName"] = initOrderList;
      initGroupItem["groupIndex"] = 0;
      state[projectNumber] = initGroupItem;

      return state;
    case "CHANGE_GROUPINFO":
      alert("123132");
      break;
    case "SET_GROUPINFO":
      return { ...payload };
    default:
      return state;
  }
};
