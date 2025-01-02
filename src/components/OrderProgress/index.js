import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { connect } from "react-redux";
import { orderProgress } from "../../js/util";
const OrderProgress = withStyles(({ spacing }) => {
  return {
    progress: {
      height: spacing(1.5),
    },
  };
})(({ classes, progress, display }) => {
  if (display) {
    switch (progress) {
      case -1:
        return "停工";
      case 10:
        return "分包班组安装中";
      default:
        return progress + "%";
    }
  } else {
    switch (progress) {
      case -1:
        return (
          <Box textAlign="center" color="red" fontSize="caption.fontSize">
            停工
          </Box>
        );
      case 10:
        return (
          <Box textAlign="center" fontSize="caption.fontSize">
            分包班组安装中
          </Box>
        );
      default:
        return (
          <Box textAlign="center">
            <Box fontSize="caption.fontSize">{`${Math.round(progress)}%`}</Box>
            <Box width="100%">
              <LinearProgress
                className={classes.progress}
                value={progress}
                variant="determinate"
              />
            </Box>
          </Box>
        );
    }
  }
});

export default connect(({ orderActivities }, { orderNumber, display }) => {
  return {
    progress: orderProgress(orderActivities, orderNumber),
    display,
  };
})(OrderProgress);
