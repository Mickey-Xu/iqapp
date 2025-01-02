import { Box } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as action from "actions";
import FFTab from "components/FFTab";
import TaskList from "components/TaskList";
import { LocalizeContext } from "i18n";
import * as repo from "js/fetch";
import { getTaskCount } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { taskCleaner } from "js/publicFn";

const Tasks = ({ type, tasksData, submit }) => {
  const history = useHistory();
  const i18n = React.useContext(LocalizeContext);
  const [status, setStatus] = React.useState("open");

  const tabs = [
    { title: i18n.ISNTAPP_TO_COMPLETE, value: "open" },
    { title: i18n.ISNTAPP_TO_CLOSE, value: "pending" },
    { title: i18n.ISNTAPP_CLOSED, value: "close" },
  ];

  let currentStatusTasks = [];

  if (status === "open") {
    tasksData.forEach((item) => {
      if (item.Status === "A") {
        currentStatusTasks.push(item);
      }
    });
  }

  if (status === "pending") {
    tasksData.forEach((item) => {
      if (item.Status === "D") {
        currentStatusTasks.push(item);
      }
    });
  }

  if (status === "close") {
    tasksData.forEach((item) => {
      if (item.Status === "CL") {
        currentStatusTasks.push(item);
      }
    });
  }

  currentStatusTasks.sort((a, b) =>
    a.DueDate ? (a.DueDate > b.DueDate ? 1 : -1) : 1
  );

  const pending = getTaskCount().awaitCloseNum;
  const open = getTaskCount().awaitComplateNum;
  return (
    <PrimaryLayout name="tasks" title={i18n.INSTAPP_JOBLIST_TASKS}>
      <Box
        style={{
          position: "fixed",
          top: "52px",
          width: "100%",
          zIndex: "10000",
        }}
      >
        <FFTab
          tabs={tabs}
          selectedTabValue={"open"}
          onTabChange={(value) => setStatus(value)}
        />
        {type === "assigner"
          ? pending > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  left: "55%",
                  padding: "2px 8px",
                  backgroundColor: "red",
                  borderRadius: "40px",
                  color: "white",
                }}
              >
                {pending}
              </span>
            )
          : open > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  left: "21%",
                  padding: "2px 8px",
                  backgroundColor: "red",
                  borderRadius: "40px",
                  color: "white",
                }}
              >
                {open}
              </span>
            )}
      </Box>

      <Box
        style={{
          width: "100%",
          padding: "16px",
          position: "absolute",
          top: "32px",
          height: window.screen.height - 157 + "px",
          overflow: "hidden auto",
        }}
      >
        <TaskList
          data={currentStatusTasks}
          status={status}
          type={type}
          submit={(submitDatas) => {
            submit(submitDatas);
          }}
        ></TaskList>
      </Box>

      {type === "assigner" && (
        <Box
          variant="contained"
          color="secondary"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "16px",
          }}
          onClick={() => {
            history.push("/taskcreate");
          }}
        >
          <Fab style={{ backgroundColor: "#cb0c33a8", color: "white" }}>
            <AddIcon />
          </Fab>
        </Box>
      )}
    </PrimaryLayout>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;
  const { params } = match;
  const { type } = params;

  const { tasks, orders, projects } = state;

  return {
    type,
    tasksData:
      type === "assigner"
        ? taskCleaner(tasks.assigner, orders, projects) || []
        : type === "assignee"
        ? taskCleaner(tasks.assignee, orders, projects) || []
        : [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submit: (submitDatas) => {
      dispatch(action.fetchCreateTask([submitDatas])).then((response) => {
        repo.fetchTasks().then((data) => {
          dispatch(action.setTasks(data));
        });
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
