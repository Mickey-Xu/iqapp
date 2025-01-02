export const validate = (fields, data) => {
  let result = {};

  fields.forEach((field) => {
    const { label, name, required } = field;
    if (required && !(data[name]?.length > 0)) {
      result = {
        ...result,
        [name]: { message: `${label || name} is required` },
      };
    }
  });

  return result;
};

export const hasError = (validation) => {
  return Object.keys(validation).some((item) => {
    return !!validation[item].message;
  });
};
