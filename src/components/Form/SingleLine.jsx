import { TextField } from "@material-ui/core";
import React from "react";

export const SingleLine = ({
  autoFocus,
  data,
  errorMessage,
  label,
  name,
  onChange,
  placeholder,
  readonly,
  required,
}) => {
  return (
    <TextField
      autoFocus={autoFocus}
      error={!!errorMessage}
      fullWidth
      helperText={errorMessage}
      id={name}
      inputProps={{ readOnly: readonly }}
      label={label}
      margin="normal"
      name={name}
      onChange={(e) => {
        onChange(name, e.target.value);
      }}
      placeholder={placeholder}
      required={required}
      value={data[name] || ""}
    />
  );
};
