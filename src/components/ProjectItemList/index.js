import { Box, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { DescriptionOutlined } from "@material-ui/icons";
import * as action from "actions";
import { LocalizeContext } from "i18n";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const ProjectItemList = withStyles(({ spacing }) => {
  return {
    box: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "#ffffff",
      padding: "10px 20px",
      marginBottom: 10,
    },
    root: {
      backgroundColor: "#ffffff",
      padding: "10px 20px",
      marginBottom: 10,
    },
    title: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "'Arial Negreta', 'Arial Normal', 'Arial'",
    },
    content: {
      color: "#878787",
      fontSize: 14,
      fontFamily: "'Arial Negreta', 'Arial Normal', 'Arial'",
      marginTop: spacing(0.4),
    },
    contant: {
      fontSize: 14,
      fontFamily: "'Arial Negreta', 'Arial Normal', 'Arial'",
      width: "140px",
      borderRadius: "10px",
      margin: "1px 0 1px 2px",
      paddingLeft: "7px",
    },
    dueDate: {
      backgroundColor: "red!important",
      color: "white",
    },
    plannedDate: {
      backgroundColor: "#8bc34a!important",
      color: "white",
    },
    unConfirmDate: {
      backgroundColor: "rgb(224, 224, 224)",
      color: "rgb(166, 166, 166)",
    },
    date: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    install: {
      backgroundColor: "#8bc34a !important",
      color: "white",
      width: spacing(12),
      height: spacing(4),
      padding: spacing(0),
    },
    stopWork: {
      backgroundColor: "red !important",
      color: "white",
      width: spacing(12),
      height: spacing(4),
      padding: spacing(0),
    },
    goodsAfloat: {
      backgroundColor: "#9c9c9c !important",
      color: "white",
      width: spacing(12),
      height: spacing(4),
      padding: spacing(0),
    },
  };
})(({ classes, data, toOrder }) => {
  const history = useHistory();
  const i18n = React.useContext(LocalizeContext);

  return data.map((item, index) => {
    if (item) {
      return (
        <Box
          className={classes.box}
          key={index}
          onClick={() => toOrder(history, item.orderNumber)}
        >
          <Box>
            <Typography className={classes.title}>
              {item.orderNumber}
            </Typography>
            <Typography className={classes.content}>
              {item.productFamily}
            </Typography>
            <Typography className={classes.content}>
              {i18n.ISNTAPP_DESIGNATION}:{item.unitDesignation}
            </Typography>
            <Typography className={classes.content}>
              {i18n.ISNTAPP_INSTALLATION_METHODS}:{item.installationMethod}
            </Typography>
            <Typography className={classes.content}>
              {i18n.INSTALLATION_STOPS}:{item.stops}
            </Typography>
            <Typography className={classes.content}>
              {i18n.INSTALLATION_HOIST_HEIGHT}:{item.hoistHeight}
            </Typography>
          </Box>
          <Box>
            <Button
              className={
                item.elevatorProgress === "安装中"
                  ? classes.install
                  : item.elevatorProgress === "停工中"
                  ? classes.stopWork
                  : item.elevatorProgress === "未到货" && classes.goodsAfloat
              }
            >
              {item.elevatorProgress}
            </Button>
            <Typography
              style={{
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                color: "#878787",
                justifyContent: "space-between",
              }}
            >
              <DescriptionOutlined style={{ color: "#949894" }} />
              {item.documentCompleteStatus}
            </Typography>
          </Box>
        </Box>
      );
    } else {
      return null;
    }
  });
});

export default connect(
  (state, { data }) => {
    return {
      data,
    };
  },
  (dispatch) => {
    return {
      toOrder: (history, orderNumber) => {
        history.push(`/order/${orderNumber}`);
        dispatch(action.setOrderDetailPageDefaultTab("basic"));
      },
    };
  }
)(ProjectItemList);
