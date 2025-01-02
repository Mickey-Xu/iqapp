import { Box } from "@material-ui/core";
import FFTab from "components/FFTab";
import TaskListItem from "components/TaskListItem";
import { LocalizeContext } from "i18n";
import { toDoOrDone } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import * as action from "actions";
import * as util from "js/util";
import { finishOrCloseCheck } from "js/util";
import store from "js/store";

const Tasks = ({ type, tasksData, getTaskCount, submit, orders, orderActivities, templates, taskDefaultTab }) => {
  const i18n = React.useContext(LocalizeContext);
  const [status, setStatus] = React.useState(taskDefaultTab ? taskDefaultTab :'open');
  const params = useParams()
  const awaitStart = getTaskCount(tasksData, 'awaitStart');
  const awaitComplate = getTaskCount(tasksData,'awaitComplate');
  const awaitClose = getTaskCount(tasksData, 'awaitClose');
  const tabs = [
    { title: i18n.ISNTAPP_TO_COMPLETE, value: "open" },
    { title: i18n.ISNTAPP_TO_CLOSE, value: "pending" },
    { title: i18n.ISNTAPP_CLOSED, value: "close" },
  ];

  let currentStatusTasks = [];

  if (status === "open") {
    tasksData.forEach((item) => {
      if (item.status === "awaitComplate" || item.status === "awaitStart") {
        currentStatusTasks.push(item);
      }
    });
  }

  if (status === "pending") {
    tasksData.forEach((item) => {
      if (item.status === "awaitClose") {
        currentStatusTasks.push(item);
      }
    });
  }

  if (status === "close") {
    tasksData.forEach((item) => {
      if (item.status === "closed") {
        currentStatusTasks.push(item);
      }
    });
  }

  useEffect(() => {
    store.dispatch(action.setTaskDefaultTab(status))
  }, [status])
  
  return (
    <PrimaryLayout name="tasks" title={i18n?.[params.type] ? i18n?.[params.type] : params.type}>
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
          selectedTabValue={taskDefaultTab ? taskDefaultTab : 'open'}
          onTabChange={(value) => setStatus(value)}
        />
        <span
          style={{
            position: "absolute",
            top: "0",
            left: "22%",
            padding: "2px 8px",
            backgroundColor: "red",
            borderRadius: "40px",
            color: "white",
            display: (awaitComplate + awaitStart) >0?'block':'none'
          }}
        >
          {awaitComplate + awaitStart}
        </span>
            <span
              style={{
                position: "absolute",
                top: "0",
                left: "55%",
                padding: "2px 8px",
                backgroundColor: "red",
                borderRadius: "40px",
                color: "white",
                display: awaitClose > 0 ? 'block' : 'none'
              }}
            >
          {awaitClose}
        </span>
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
        <TaskListItem
          data={currentStatusTasks}
          status={status}
          type={type}
          submit={(type, data) => { 
            const activityParams = util.setActivityStatusParams(
              data.projectNo,
              data.orderNo,
              data.activityNo,
              util.formatDateToYMD(new Date()),
              1,
              orderActivities,
              orders
            );
            if (type === "start") {
              submit(type, data, activityParams)
            } else {
              finishOrCloseCheck(type, orderActivities, data, templates, orders, submit, activityParams)
        
            }
        
          }}
        ></TaskListItem>
      </Box>
    </PrimaryLayout>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;
  const { params } = match;
  const { type } = params;
  const { tasks, orders, templates, documentList, orderActivities, settings: { taskDefaultTab } } = state;
  let data = Object.keys(tasks).length > 0 ? tasks : [];
  let taskList = data.filter((item) => item.taskType === type);

  taskList.forEach((item) =>
  {
    item['productFamily'] = orders[item?.orderNo]?.productFamily;
    item['documentStatus'] = toDoOrDone(
      orders[item?.orderNo]?.projectNumber,
      item.orderNo,
      item.activityNo,
      templates,
      documentList
      );
    }
  )

  return {
    type,
    tasksData: taskList,
    orders,
    orderActivities,
    templates,
    taskDefaultTab
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submit: (type, data, activityParams) => {
      dispatch(action.processingTasks(type, data,activityParams,dispatch))
    },
    getTaskCount: (task, status) => {
      let count = task.filter((item) => item.status === status).length
      return count
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
