const initData = {};

export default (state = initData, { type, payload }) => {
  switch (type) {
    case "SET_DOCUMENT_LIST":
      return { ...payload };
    case "UPDATE_DOCUMENT_LIST":
      const {
        projectNo,
        orderNo,
        activityNo,
        documentName,
        modified,
      } = payload;
      const newState = { ...state };
      if (!newState[projectNo]) {
        newState[projectNo] = {};
      }

      if (!newState[projectNo][orderNo]) {
        newState[projectNo][orderNo] = {};
      }

      if (!newState[projectNo][orderNo][activityNo]) {
        newState[projectNo][orderNo][activityNo] = [];
      }

      if (
        newState[projectNo][orderNo][activityNo].some(
          (e) => e.name === documentName
        )
      ) {
        newState[projectNo][orderNo][activityNo].forEach((item) => {
          if (item.name === documentName) {
            item.modified = modified;
          }
        });
      } else {
        newState[projectNo][orderNo][activityNo].push({
          name: documentName,
          modified: modified,
        });
      }
      return newState;
    default:
      return state;
  }
};
