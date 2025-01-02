import { Box, makeStyles, Slider as MUISlicder } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    borderBottom: " 1px solid #e0e0e0",
    borderTop: " 1px solid #e0e0e0",
    margin: spacing(1, 0),
    padding: spacing(1, 0),
  },
}));

export const Slider = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <Typography variant="subtitle2">{props.label}</Typography>
      <MUISlicder
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={props.onChange}
        valueLabelDisplay="auto"
      />
      <i>{props.description}</i>
    </Box>
  );
};
