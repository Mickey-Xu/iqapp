import {
  Box,
  FormControlLabel,
  InputLabel,
  Radio as MuiRadio,
  RadioGroup,
} from "@material-ui/core";
import React from "react";

export const Radio = ({ data, label, name, options, onChange }) => {
  return (
    <Box mt={2} mb={1}>
      <InputLabel>{label}</InputLabel>
      <RadioGroup
        color="primary"
        name={name}
        onChange={(e) => {
          onChange(name, e.target.value);
        }}
        value={data[name] || ""}
      >
        {options.map((item) => {
          return (
            <FormControlLabel
              control={<MuiRadio />}
              key={item.value}
              label={item.text}
              value={item.value}
            />
          );
        })}
      </RadioGroup>
    </Box>
  );
};
