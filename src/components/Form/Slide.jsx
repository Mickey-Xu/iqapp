import { Box, InputLabel, Slider as MuiSlider } from "@material-ui/core";
import React from "react";

export const Slide = ({ data, label, name, onChange }) => {
  return (
    <Box mt={2} mb={1}>
      <InputLabel>{label}</InputLabel>
      <MuiSlider
        color="primary"
        onChange={(e, value) => {
          onChange(name, value);
        }}
        value={data[name] || 0}
      />
    </Box>
  );
};
