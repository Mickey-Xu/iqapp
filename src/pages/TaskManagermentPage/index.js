import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { AssignmentOutlined, ChevronRight } from "@material-ui/icons";
import { LocalizeContext } from "i18n";
import { getTaskCount } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const TaskManagermentPage = withStyles(({ spacing }) => {
  return {
    root: {
      width: `calc(100% - 16px)`,
      height: `calc(100% - 16px)`,
      display: "flex",
      flexDirection: "column",
      margin: "8px",
    },
    itemBox: {
      width: "100%",
      padding: "4px",
      margin: "4px",
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid darkgray",
    },
    itemIcon: {
      width: `24px`,
      color: "rgb(220,0,0)",
      paddingTop: "4px",
      margin: "0 4px",
    },
    discriptionBox: {
      width: `calc(100% - 54px)`,
    },
    iconBox: {
      paddingTop: "6px",
      width: "6px",
      color: "rgb(220,0,0)",
    },
    discription: {
      padding: spacing(0.5, 1),
      backgroundColor: "red",
      borderRadius: "30px",
      color: "white",
      marginLeft: spacing(1),
    },
  };
})(({ classes, taskNum: { awaitCloseNum, awaitComplateNum } }) => {
  const history = useHistory();
  const i18n = React.useContext(LocalizeContext);
  return (
    <PrimaryLayout
      name="taskManagerment"
      title={i18n.INSTAPP_JOBLIST_TASKS}
      pageLevel={1}
    >
      <Box className={classes.root}>
        <Box
          className={classes.itemBox}
          onClick={() => {
            history.push(`/tasks/assigner`);
          }}
        >
          <Box className={classes.itemIcon}>
            <AssignmentOutlined />
          </Box>
          <Box className={classes.discriptionBox}>
            {i18n.ISNTAPP_TASKS_CREATED_BY_ME}
            {awaitCloseNum > 0 && (
              <span className={classes.discription}>{awaitCloseNum}</span>
            )}
          </Box>
          <Box className={classes.iconBox}>
            <ChevronRight />
          </Box>
        </Box>
        <Box
          className={classes.itemBox}
          onClick={() => {
            history.push(`/tasks/assignee`);
          }}
        >
          <Box className={classes.itemIcon}>
            <AssignmentOutlined />
          </Box>
          <Box className={classes.discriptionBox}>
            {i18n.ISNTAPP_TASKS_ASSIGUED_TO_ME}
            {awaitComplateNum > 0 && (
              <span className={classes.discription}>{awaitComplateNum}</span>
            )}
          </Box>
          <Box className={classes.iconBox}>
            <ChevronRight />
          </Box>
        </Box>
      </Box>
    </PrimaryLayout>
  );
});
export default connect((state, props) => {
  const taskNum = getTaskCount();
  return {
    taskNum,
  };
})(TaskManagermentPage);
