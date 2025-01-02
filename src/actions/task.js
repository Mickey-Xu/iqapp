import * as api from "api";
import * as action from "actions";
import { db } from "js/db";
import { taskDataConversion } from "js/util";

export const setTasks = (data) => ({
  type: "SET_TASKS",
  payload: data,
});

export const fetchCreateTask = (data) => (dispatch) => {
  dispatch(action.showLoading());
  return api
    .createTask(data)
    .then((response) => {
      //get task
      dispatch(action.hideLoading());
    })
    .catch((error) => {
      if (error.code === 401) {
        dispatch(action.setAuth(null));
      }
      dispatch(action.setError(error.message));
    })
    .finally(() => {
      dispatch(action.hideLoading());
    });
};


export const processingTasks = (type, data, activityParams) => (dispatch) => {
  dispatch(action.showLoading());
  const auth = JSON.parse(window.localStorage.getItem("auth"));

  const userInfo = {
    userId: auth.userName
  };

  return api
    .processingTasks(type.toLocaleUpperCase(), data.taskId, userInfo)
    .then((response) => {
      if (response.data?.code !== 200) {
        dispatch(action.setError(response.data?.message));
        return false;
      }
      dispatch(action.hideLoading());
      db.cache.get("tasks").then((cache) => {
        const resp = response.data.data;
        const result = taskDataConversion(resp)
        const lastData = cache.data.map(task =>
          task.taskId === data.taskId
            ? { ...task, ...result } 
            : task
        );
        db.cache.put({ id: "tasks", data: lastData }).then(() => {
          dispatch(action.setTasks(lastData));
        });
      });      
      if (data.taskType === "COMMISSIONING" && type === "finish") {
        dispatch(action.updateOrderActivityStatus(activityParams));
      }
    })
    .catch((error) => {
      dispatch(action.setError(error.message));
    })  
    .finally(() => {
      dispatch(action.hideLoading());
    });
}