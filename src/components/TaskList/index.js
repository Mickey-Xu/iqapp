import { Box, Typography } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import ConfirmModal from "components/ConfirmModal";
import TaskListCard from "components/TaskListCard";
import { LocalizeContext } from "i18n";
import moment from "moment";
import React from "react";

const TaskList = ({ data, status, type, submit }) => {
  const i18n = React.useContext(LocalizeContext);

  const [open, setOpen] = React.useState(null);

  const [currentTask, setCurrentTask] = React.useState("");
  const [cplDate, setCplDate] = React.useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [description, setDescription] = React.useState("");
  const [submitData, setSubmitData] = React.useState(null);

  const handleClickOpen = (action, taskName, currentTaskData) => {
    setOpen(action);
    setCurrentTask(taskName);
    setSubmitData(currentTaskData);
  };

  const handleClose = () => {
    setOpen(false);
    setCplDate(moment(new Date()).format("YYYY-MM-DD"));
    setDescription("");
  };

  const handleClick = () => {
    const submitDatas = submitData;

    if (open === "done" && cplDate && description) {
      submitDatas.CPLDate = cplDate;
      submitDatas.AssigneeCMNT = description;
      submitDatas.Status = "D";
      submit(submitDatas);
      setOpen(false);
      setCplDate("");
      setDescription("");
    }
    if (open === "delete") {
      submitDatas.Status = "DL";
      submit(submitDatas);
      setOpen(false);
    }
    if (open === "close") {
      submitDatas.Status = "CL";
      submit(submitDatas);
      setOpen(false);
    }
  };

  return (
    <Box>
      {data.map((item, index) => {
        return (
          <TaskListCard
            data={item}
            type={type}
            status={status}
            handleClickOpen={(action, taskName, currentTaskData) =>
              handleClickOpen(action, taskName, currentTaskData)
            }
            key={index}
          />
        );
      })}
      <ConfirmModal
        open={open === "done" || open === "delete" || open === "close"}
        handleClick={handleClick}
        onClose={handleClose}
        title={currentTask}
      >
        <Box mb={1}>
          <Typography
            variant="body2"
            color={
              open === "done" ? (cplDate ? "initial" : "error") : "initial"
            }
          >
            {open === "done" && `*` + i18n.ISNTAPP_PLEASE_SELECT_COnFIRM_DATE}
            {open === "delete" && i18n.ISNTAPP_CONFIRM_TO_DELETE_THIS_TASK}
            {open === "close" && i18n.ISNTAPP_CONFIRM_TO_CLOSE_THIS_TASK}
          </Typography>
        </Box>
        {open === "done" && (
          <Box>
            <Box mb={1}>
              {/* <input
                type="date"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setCplDate(e.target.value);
                }}
                value={cplDate}
              /> */}
              <DatePicker
                autoOk
                fullWidth
                required
                disableToolbar={true}
                variant="inline"
                value={cplDate ? new Date(cplDate) : null}
                format="YYYY/MM/DD"
                maxDate={new Date()}
                onChange={(d) => {
                  setCplDate(moment(d).format("YYYY-MM-DD"));
                }}
              />
            </Box>
            <Box mb={1}>
              {open === "done" && (
                <Typography
                  variant="body2"
                  color={
                    open === "done"
                      ? description
                        ? "initial"
                        : "error"
                      : "initial"
                  }
                >
                  *{i18n.ISNTAPP_COMPLETE_COMMENT}
                </Typography>
              )}
            </Box>
            <Box mb={1}>
              <textarea
                rows="6"
                placeholder={i18n.ISNTAPP_COMPLETE_COMMENT}
                style={{ width: "100%", resize: "none" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              ></textarea>
            </Box>
          </Box>
        )}
      </ConfirmModal>
    </Box>
  );
};

export default TaskList;
