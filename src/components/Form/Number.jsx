import { TextField } from "@material-ui/core";
import React from "react";

export const Password = ({
  autoFocus,
  data,
  label,
  name,
  onChange,
  placeholder,
}) => {
  return (
    <TextField
      autoFocus={autoFocus}
      fullWidth
      id={name}
      label={label}
      margin="normal"
      name={name}
      onChange={(e) => {
        onChange(name, e.target.value);
      }}
      placeholder={placeholder}
      required={true}
      type="number"
      value={data[name]}
    />
  );
};
