function versionUpdating(state = {}, action) {
  const { payload } = action;
  switch (action.type) {
    case "SW_INIT":
      return {
        ...state,
        serviceWorkerInitialized: !state.serviceWorkerInitialized,
      };
    case "SW_UPDATE":
      return {
        ...state,
        serviceWorkerUpdated: !state.serviceWorkerUpdated,
        serviceWorkerRegistration: payload,
      };
    default:
      return state;
  }
}

export default versionUpdating;
