import { get, post } from "./base";

export const fetchTasks = (data) => {
  return get("/app/persTaskGet", data);
};

export const fetchIDPTTasks = (userId) => {
  let id = userId.length === 6 ? '00' + userId : userId;
  return get(`/app/LDPTDb/GetTasks?Executor=${id}`);
};

export const fetchEISVOrdersData = (data=[]) => {
  let url = "app/ordersGet/ByOrders"
  data.forEach((item, index) => {
    // eslint-disable-next-line
    url += (index===0?'?':'')+'orders=' + `${item}${data.length-1!==index?'&':''}`
  })
  return get(url);
};

export const createTask = (data) => {
  return post("/app/persTaskSet", data);
};

export const processingTasks = (action,id,data) => {
  return post(`/app/LDPTDb/${id}/${action}?body=${JSON.stringify(data)}`);
} 