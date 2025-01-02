import { InputBase, InputLabel } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

export const Static = withStyles(({ spacing }) => ({
  margin: {
    margin: spacing(2, 0, 1, 0),
  },
}))(({ classes, data, label, name }) => {
  return (
    <FormControl className={classes.margin}>
      {label && <InputLabel shrink>{label}</InputLabel>}
      <InputBase
        className={classes.margin}
        id={name}
        value={data[name] || ""}
      />
    </FormControl>
  );
});
