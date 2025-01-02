import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import React from "react";
import { withStyles } from "@material-ui/core/styles";

export const Checkbox = withStyles(({ spacing }) => {
  return {
    root: {
      margin: spacing(2, 0, 1, 0),
    },
  };
})(({ classes, data, label, name, onChange }) => {
  return (
    <FormControl className={classes.root} fullWidth>
      <FormControlLabel
        control={
          <MuiCheckbox
            name={name}
            color="primary"
            checked={data[name] || false}
            onChange={(e) => {
              onChange(name, e.target.checked);
            }}
          />
        }
        label={label}
      />
    </FormControl>
  );
});
