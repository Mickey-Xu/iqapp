export const resetFormData = () => ({ type: "RESET_FORM_DATA" });

export const setFormData = (data) => ({
  type: "SET_FORM_DATA",
  payload: data,
});
