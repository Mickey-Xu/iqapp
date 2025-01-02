import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import React from "react";

export const PhoneNumber = ({ data, label, name, onChange }) => {
  return (
    <FormControl fullWidth margin="dense" required>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        id={name}
        value={data[name] || ""}
        onChange={(e) => {
          onChange(name, e.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <PersonOutlineOutlinedIcon color="action" />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
