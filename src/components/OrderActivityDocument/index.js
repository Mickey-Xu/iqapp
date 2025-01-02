import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import React from "react";
import { useHistory } from "react-router-dom";

const OrderActivityDocument = withStyles(() => {
  return {
    root: {
      display: "flex",
      alignItems: "center",
    },
  };
})(({ classes, status }) => {
  const history = useHistory();

  return (
    <Box
      className={classes.root}
      onClick={() => {
        history.push("./documents");
      }}
    >
      {status}
      <ChevronRightIcon fontSize="small" />
    </Box>
  );
});

export default OrderActivityDocument;
