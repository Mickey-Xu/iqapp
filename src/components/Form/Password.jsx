import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React from "react";

export const Password = ({ data, label, name, onChange }) => {
  return (
    <FormControl fullWidth margin="dense" required>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        id={name}
        type="password"
        value={data[name] || ""}
        onChange={(e) => {
          onChange(name, e.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <LockOutlinedIcon color="action" />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
