import { Backdrop, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { connect } from "react-redux";

const Loading = withStyles(({ zIndex }) => ({
  backdrop: {
    zIndex: zIndex.drawer + 1,
    color: "#fff",
  },
}))(({ classes, loading }) => {
  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
});

export default connect(({ loading }) => {
  return {
    loading,
  };
})(Loading);
