const setLoading = (loading) => {
  return { type: "SET_LOADING", payload: loading };
};

export const hideLoading = () => setLoading(false);

export const showLoading = () => setLoading(true);
