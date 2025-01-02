import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { DatePicker } from "@material-ui/pickers";
import * as action from "actions";
import { LocalizeContext } from "i18n";
import * as repo from "js/fetch";
import PrimaryLayout from "layouts/PrimaryLayout";
import lodash from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { connect } from "react-redux";

const TaskCreatePage = withStyles(({ spacing }) => {
  return {
    root: {
      width: `calc(100% - 16px)`,
      height: `calc(100% - 16px)`,
      display: "flex",
      flexDirection: "column",
      margin: "8px",
      color: "rgb(220,0,0)",
    },
    itemBox: {
      width: "100%",
      padding: "4px",
      margin: "4px",
      display: "flex",
      alignItems: "center",
      // backgroundColor: "white",
    },
    projectNo: {
      // marginLeft: spacing(6),
      display: "flex",
      justifyContent: "space-between",
    },
  };
})(
  ({
    classes,
    assignerList,
    orderList,
    projectList,
    partnerNo,
    fetchCreateTask,
    orders,
  }) => {
    const i18n = React.useContext(LocalizeContext);

    const [description, setDescription] = useState("");
    const [details, setDetails] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [orderNo, setOrderNo] = useState("");
    const [dueDate, setDueDate] = useState(
      moment(new Date()).format("YYYY-MM-DD")
    );
    const [assigneeID, setAssigneeID] = useState("");

    const createTaskFn = () => {
      if (description.length === 0) {
        alert("任务简介是必填字段");
        return;
      } else if (details.length === 0) {
        alert("任务明细是必填字段");
        return;
      } else if (projectNo.length === 0 && orderNo?.length === 0) {
        alert("订单号是必填字段");
        return;
      } else if (orderNo?.length === 0 && projectNo.length === 0) {
        alert("项目编号是必填字段");
        return;
      } else if (dueDate.length === 0) {
        alert("到期日是必填字段");
        return;
      } else if (assigneeID.length === 0) {
        alert("被分配人是必填字段");
        return;
      }
      const data = [
        {
          partnerNo: partnerNo,
          projectNo: projectNo,
          orderNo: orderNo,
          dueDate: dueDate,
          status: "A",
          description: description,
          details: details,
          assigneeID: assigneeID,
          cplDate: "",
          assigneeCMNT: "",
        },
      ];
      fetchCreateTask(data);
      repo.fetchTasks();
      window.history.back(-1);
    };
    return (
      <PrimaryLayout name="task" title={i18n.ISNTAPP_TASK_CREATED}>
        <form className={classes.root} autoComplete="off">
          <Box className={classes.itemBox}>
            <TextField
              fullWidth
              required={true}
              color={"secondary"}
              label={i18n.ISNTAPP_TASK}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box className={classes.itemBox}>
            <TextField
              fullWidth
              multiline
              required={true}
              color={"secondary"}
              label={i18n.ISNTAPP_TASK_DESCRIPTION}
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          {!orderNo && (
            <Box className={classes.itemBox}>
              <TextField
                fullWidth
                select
                required={orderNo ? false : true}
                color={"secondary"}
                label={i18n.PROJECTLIST_PROJECT_NO}
                value={projectNo}
                onChange={(e) => {
                  setProjectNo(e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {projectList.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.label}
                    className={classes.projectNo}
                  >
                    <Typography variant="body2">
                      {option.projectName}
                    </Typography>
                    <Typography variant="body2">{option.value}</Typography>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          {!projectNo && (
            <Box className={classes.itemBox}>
              <TextField
                fullWidth
                select
                required={projectNo ? false : true}
                color={"secondary"}
                label={i18n.JOBLIST_ORDER_NUMBER}
                value={orderNo}
                onChange={(e) => {
                  setOrderNo(e.target.value);
                  setAssigneeID("");
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {orderList.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.value}
                    className={classes.projectNo}
                  >
                    <Typography variant="body2">
                      {option.unitDesignation}
                    </Typography>
                    <Typography variant="body2">{option.label}</Typography>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          <Box className={classes.itemBox}>
            {/* <TextField
              required
              fullWidth
              color={"secondary"}
              label={i18n.ISNTAPP_DUE_DATE}
              type={"date"}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: { min: moment().format("YYYY-MM-DD") },
              }}
            /> */}
            <DatePicker
              autoOk
              fullWidth
              required
              label={i18n.ISNTAPP_DUE_DATE}
              disableToolbar={true}
              variant="inline"
              value={dueDate ? new Date(dueDate) : null}
              minDate={new Date()}
              format="YYYY/MM/DD"
              onChange={(d) => {
                setDueDate(moment(d).format("YYYY-MM-DD"));
              }}
            />
          </Box>
          <Box className={classes.itemBox}>
            <TextField
              required
              fullWidth
              select
              color={"secondary"}
              label={i18n.ISNTAPP_ASSIGNEE}
              value={assigneeID}
              onChange={(e) => {
                setAssigneeID(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {projectNo
                ? lodash
                    .unionBy(
                      assignerList.filter((item) => {
                        return (
                          Object.keys(orders)
                            .filter((item) => {
                              return orders[item].projectNumber === projectNo;
                            })
                            .indexOf(item.orderNum) > -1
                        );
                      }),
                      "label"
                    )
                    .map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                : assignerList
                    .filter((item) => {
                      return item.orderNum === orderNo;
                    })
                    .map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
            </TextField>
          </Box>
          <Button
            style={{
              backgroundColor: "rgb(220,0,0)",
              color: "white",
              marginTop: "20px",
            }}
            onClick={() => {
              createTaskFn();
            }}
          >
            {i18n.ISNTAPP_SUBMIT}
          </Button>
        </form>
      </PrimaryLayout>
    );
  }
);

const mapStateToProps = ({ partners, orders, projects, auth }) => {
  // const filterList = new Set();
  const orderList = Object.keys(orders)
    .map((order) => {
      return {
        label: order,
        value: order,
        unitDesignation: orders[order].unitDesignation,
      };
    })
    .sort((a, b) => (a.label ? (a.label > b.label ? 1 : -1) : 1));
  orderList.unshift({ label: "", value: "", unitDesignation: "" });
  const projectList = Object.keys(projects)
    .map((project) => {
      return {
        label: project,
        value: project,
        projectName: projects[project].description,
      };
    })
    .sort((a, b) => (a.label ? (a.label > b.label ? 1 : -1) : 1));
  projectList.unshift({ label: "", value: "", projectName: "" });

  return {
    assignerList: Array.from(
      new Set(
        Object.keys(partners)
          .filter((partner) => {
            return (
              partners[partner].functionNumber === "Z(" ||
              partners[partner].functionNumber === "VW" ||
              partners[partner].functionNumber === "YI"
            );
          })
          .map((item) => {
            let lable;
            if (partners[item].functionNumber === "Z(") {
              lable = `PE-${partners[item].name1}`;
            } else if (partners[item].functionNumber === "VW") {
              lable = `TL-${partners[item].name1}`;
            } else {
              lable = `PM-${partners[item].name1}`;
            }

            return {
              label: lable,
              value: partners[item].number,
              orderNum: partners[item].orderNumber,
            };
          })
      )
    )
      .sort((a, b) => (a.label ? (a.label > b.label ? 1 : -1) : 1))
      .filter((items) => {
        return items;
      }),
    orderList: orderList,
    projectList: projectList,
    partnerNo: auth.personalNumber,
    orders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCreateTask: (data) => {
      dispatch(action.fetchCreateTask(data)).then((response) => {
        repo.fetchTasks().then((data) => {
          dispatch(action.setTasks(data));
        });
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskCreatePage);
