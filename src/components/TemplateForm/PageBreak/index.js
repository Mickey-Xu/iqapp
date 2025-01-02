import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  hr: {
    borderTop: "dotted 1px",
  },
}));

export const PageBreak = () => {
  const classes = useStyles();

  return <hr className={classes.hr} />;
};
