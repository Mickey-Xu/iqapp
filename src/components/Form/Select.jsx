import { Box, InputLabel, Select as MuiSelect } from "@material-ui/core";
import React from "react";

export const Select = ({ data, label, name, options, onChange }) => {
  return (
    <Box mt={2} mb={1}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        color="primary"
        fullWidth
        name={name}
        native
        onChange={(e) => {
          onChange(name, e.target.value);
        }}
        value={data[name] || ""}
      >
        {options.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          );
        })}
      </MuiSelect>
    </Box>
  );
};
