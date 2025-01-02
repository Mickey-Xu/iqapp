import React from "react";
import { Box } from "@material-ui/core";
import TaskItemCard from "components/TaskItemCard";

const TaskList = ({ data, status, type, submit }) => {
  return (
    <Box>
      {data.map((item, index) => {
        return (
          <TaskItemCard
            data={item}
            type={type}
            status={status}
            submit={(action,data) =>
              submit(action,data)
            }
            key={index}
          />
        );
      })}
    </Box>
  );
};

export default TaskList;
