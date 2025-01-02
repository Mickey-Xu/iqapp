import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import React from "react"; // //useRef

const NativeDateInput = withStyles(() => {
  return {
    input: {
      fontSize: "16px",
      position: "absolute",
      top: -1000,
    },
    alarm: {
      backgroundColor: "red",
      color: "white",
    },
  };
})(({ alarm = false, classes, dateInputRef, onChange, value, variant }) => {
  const dataVal = value
    ? new Date(value).toLocaleDateString().substring(0, 10)
    : "";

  return (
    <Box
      className={classnames(classes.root, {
        [classes.alarm]: alarm,
      })}
    >
      {dataVal}
      <input
        className={classes.input}
        ref={dateInputRef}
        type="date"
        value={dataVal}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </Box>
  );
});

export default NativeDateInput;
