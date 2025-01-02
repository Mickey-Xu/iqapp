export const hideAlert = () => {
  return { type: "SET_ALERT", payload: {} };
};

export const setAlert = (alert) => {
  return { type: "SET_ALERT", payload: alert };
};

export const setError = (message) => ({
  type: "SET_ALERT",
  payload: { message, severity: "error" },
});

export const setInfo = (message) => ({
  type: "SET_ALERT",
  payload: { message, severity: "info" },
});

export const setSuccess = (message) => ({
  type: "SET_ALERT",
  payload: { message, severity: "success" },
});

export const setWarning = (message) => ({
  type: "SET_ALERT",
  payload: { message, severity: "warning" },
});
