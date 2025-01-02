import { TextField } from "@material-ui/core";
import React from "react";

export const MultiLine = ({
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
      multiline
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
