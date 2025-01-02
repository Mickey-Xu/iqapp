import axios from "axios";
import { axiosConfig, blobResponseURLs, formDataURLs } from "config";

const getPostData = (data, useFormData = false) => {
  if (useFormData) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    });
    return formData;
  } else {
    return JSON.stringify(data);
  }
};

const getQueryString = (data) => {
  let queryString = "";

  if (data) {
    queryString = Object.keys(data)
      .map((key) => {
        let result = `${encodeURIComponent(key)}=`;
        if (Array.isArray(data[key])) {
          result += data[key]
            .map((v) => {
              return `${encodeURIComponent(v)}`;
            })
            .join(`${"&" + key + "="}`);
        } else {
          result += `${encodeURIComponent(data[key])}`;
        }
        return result;
      })
      .join("&");
  }

  if (queryString) {
    return `?${queryString}`;
  }

  return queryString;
};

export const get = (url, data) => {
  return axios
    .get(url + getQueryString(data), {
      ...axiosConfig,
      responseType: blobResponseURLs.some((element) => url.startsWith(element))
        ? "blob"
        : "json",
    })
    .catch(({ message, response }) => {

      if (!response) {
        return {
          code: 0,
          message: "No Internet Connection",
          data: null
        };
      }

      if (response.status === 400 || response.status === 403) {
        return Promise.reject({
          code: response.status,
          message: response.data.error.message,
        });
      }

      if (response.status === 401) {
        return Promise.reject({
          code: response.status,
          message: "用户凭证已过期，请重新登录",
        });
      }

      return Promise.reject({ code: response.status, message });
    });
};

export const post = (url, data) => {
  const useFormData = formDataURLs.some((element) => url.startsWith(element));
  const postData = getPostData(data, useFormData);

  return axios
    .post(url, postData, {
      ...axiosConfig,
      headers: !useFormData ? { "Content-Type": "application/json" } : {},
    })
    .catch(({ message, response }) => {
      if (!response) {
        return {
          code: 0,
          message: "No Internet Connection",
          data:null
        };
      }

      if (response.status === 400 || response.status === 403) {
        return Promise.reject({
          code: response.status,
          message: response.data.error.message,
        });
      }

      if (response.status === 401) {
        return Promise.reject({
          code: response.status,
          message: "用户凭证已过期，请重新登录",
        });
      }

      return Promise.reject({ code: response.status, message });
    });
};