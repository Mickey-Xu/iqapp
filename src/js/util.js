import * as action from "actions";
import * as api from "api";
import { db } from "js/db";
import * as publicFn from "js/publicFn/index";
import store from "js/store";
import _ from "lodash";
import { isVisible } from "./templateFormUtil/index";
import * as schema from "js/schema";
import * as repo from "js/fetch";
import { normalize } from "normalizr";
import { documentAuthorizationC } from "js/publicFn";

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const timeHorizonFilter = (date, today, timeHorizon) => {
  const leadingDate = new Date(date);
  switch (timeHorizon) {
    case "thisWeek": {
      const start = today - new Date(today).getDay() * 86400000;
      const end = start + 7 * 86400000;
      return leadingDate.getTime() <= end;
    }
    case "twoWeeks": {
      const start = today - new Date(today).getDay() * 86400000;
      const end = start + 14 * 86400000;

      return leadingDate.getTime() <= end;
    }
    case "fourWeeks": {
      const start = today - new Date(today).getDay() * 86400000;
      const end = start + 28 * 86400000;

      return leadingDate.getTime() <= end;
    }
    case "eightWeeks": {
      const start = today - new Date(today).getDay() * 86400000;
      const end = start + 56 * 86400000;

      return leadingDate.getTime() <= end;
    }
    case "all":
    default: {
      return true;
    }
  }
};

export const orderActivitiesSort = (data) => {
  return data.sort(function (a, b) {
    if (a.sort < b.sort) {
      return -1;
    } else {
      return 1;
    }
  });
};

export const templatesConverter = (data) => {
  let res = {};

  data.forEach((elem) => {
    if (!res[elem.activityNo]) {
      res[elem.activityNo] = [];
    }

    res[elem.activityNo].push(elem);
  });

  return res;
};

export const groupInfoProc = (data) => {
  const res = {};

  data.forEach((value) => {
    res[value.projectNo] = JSON.parse(value.projectGroupInfo);
  });

  return res;
};

export const groupInfoDeproc = (data) => {
  const res = [];

  Object.keys(data).forEach((key) => {
    const elem = {};

    elem.projectNo = key;
    elem.projectGroupInfo = JSON.stringify(data[key]);

    res.push(elem);
  });
  return res;
};

export const fittersAssignmentTransferProc = (data) => {
  const res = {};

  data.forEach((value) => {
    if (!res[value.projectNo]) {
      res[value.projectNo] = [];
    }
    res[value.projectNo].push(value);
  });

  return res;
};

export const verify = (fields) => {
  const verifyType = [
    "singleLine",
    "paragraph",
    "number",
    "multipleChoice",
    "dropdown",
    "dropdown",
    "signature",
    "photo",
    "naYesNo",
  ];

  const defaultPhotoValue =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  for (let i = 0; i < fields.length; i++) {
    const result = isVisible(fields[i]);
    if (result) {
      for (let k = 0; k < verifyType.length; k++) {
        if (fields[i].type === verifyType[k] && fields[i].settings.required) {
          let alertInfo;
          if (fields[i].settings.labelI18n.Chinese) {
            alertInfo = fields[i].settings.labelI18n.Chinese;
          } else if (fields[i].settings.labelI18n.English) {
            alertInfo = fields[i].settings.labelI18n.English;
          } else if (fields[i].settings.descriptionI18n.Chinese) {
            alertInfo = fields[i].settings.descriptionI18n.Chinese;
          } else {
            alertInfo = fields[i].settings.descriptionI18n.English;
          }

          if (
            fields[i].settings.value === defaultPhotoValue ||
            fields[i].settings.value === "" ||
            fields[i].settings.value === "-"
          ) {
            alert(alertInfo);

            return false;
          } else if (fields[i].settings.value === "#") {
            alert(alertInfo);
            return false;
          } else if (fields[i].type === "number") {
            if (fields[i].settings.min || fields[i].settings.max) {
              if (fields[i].settings.value < fields[i].settings.min || fields[i].settings.value > fields[i].settings.max) {
                const maxMin = showNumberText(fields[i].settings.min, fields[i].settings.max);
                alert(`${alertInfo}: ${maxMin}`)
                return false;
              }
            }
          }
        }
      }
    }
  }
  return true;
};

export const toDoOrDone = (
  projectNumber,
  orderNumber,
  activityNo,
  templates,
  documentList
) => {
  const orders = store.getState().orders;
  const productLine = orders[orderNumber]?.productLine;
  const productFamily = orders[orderNumber]?.productFamily;
  const productCategory = orders[orderNumber]?.productCategory;
  const templateParms = templates[activityNo] ? templates[activityNo] : [];
  const templateDataList = getTemplateList(
    templateParms,
    productLine,
    productFamily,
    productCategory
  );

  if (templateDataList.length > 0) {
    const requiredData = templateDataList.filter(
      (item) => item.mandDoc === "X"
    );
    if (requiredData.length > 0) {
      const documents =
        documentList?.[projectNumber]?.[orderNumber]?.[activityNo];

      let count = 0;
      if (documents) {
        for (let i = 0; i < requiredData.length; i++) {
          const discription = `${requiredData[i].documentDescription}`;
          for (let k = 0; k < documents.length; k++) {
            documents[k]?.name.includes(discription) && count++;
          }
        }

        if (requiredData.length <= count) {
          return "Done";
        } else {
          return "ToDo";
        }
      } else {
        return "ToDo";
      }
    } else {
      return "Done"; //如果没有必填
    }
  } else {
    return "WithoutTemplates";
  }
};

export const timeSort = (property, bol) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];

    if (bol) {
      // 升序
      return Date.parse(value1) - Date.parse(value2);
    } else {
      // 降序
      return Date.parse(value2) - Date.parse(value1);
    }
  };
};

export const whetherToShutDown = (orderActivities, orderNumber) => {
  if (
    orderActivities[orderNumber + "-7720"] &&
    !orderActivities[orderNumber + "-7720"].confirmedDate
  ) {
    return "停工中";
  } else {
    return false;
  }
};

export const getCurrentElevatorStatus = (orderActivities, orderNumber) => {
  if (
    orderActivities[orderNumber + "-7720"] &&
    !orderActivities[orderNumber + "-7720"].confirmedDate
  ) {
    return "停工中";
  } else if (orderActivities[orderNumber + "-7350"]?.confirmedDate) {
    return "安装中";
  } else {
    return "未到货";
  }
};

export const orderProgress = (orderActivities, orderNumber) => {
  //电梯整体安装进度

  if (orderActivities[orderNumber + "-7800"]?.confirmedDate) {
    return 100;
  }
  if (orderActivities[orderNumber + "-70D0"]?.confirmedDate) {
    return 60;
  }
  if (
    orderActivities[orderNumber + "-7020"]?.confirmedDate &&
    !orderActivities[orderNumber + "-70D0"]
  ) {
    return 60;
  }
  if (orderActivities[orderNumber + "-8010"]?.confirmedDate) {
    return 30;
  } else {
    return 0;
  }
};

//电梯安装进度
export const elevatorInstallationProgress = (
  projectNumber,
  orderActivities,
  orderNo,
  documentList
) => {
  if (!orderActivities[orderNo + "-7040"]) {
    // 三步
    const threeStep = ["7010", "7020", "7600"];
    const orderActivitie = Object.keys(orderActivities).filter((item) => {
      return (
        orderActivities[item].orderNumber === orderNo &&
        threeStep.indexOf(orderActivities[item].activityNumber) > -1
      );
    });

    const progress = orderActivitie.filter((item) => {
      return orderActivities[item].confirmedDate !== null;
    });

    return Math.round((progress.length * 100) / 3) + "%";
  } else {
    // 十四步
    let elevatorInstallationProgress = 0;
    const steps14 = [
      "7010",
      "7020",
      "7030",
      "7040",
      "7050",
      "7060",
      "7070",
      "7080",
      "7090",
      "70A0",
      "70B0",
      "70C0",
      "70D0",
      "7600",
    ];

    steps14.forEach((step) => {
      if (
        orderActivities[orderNo + "-" + step].editable &&
        orderActivities[orderNo + "-" + step].confirmedDate
      ) {
        elevatorInstallationProgress += 1;
      } else if (!orderActivities[orderNo + "-" + step].editable) {
        const documentActivity = documentList[projectNumber]?.[orderNo]?.[step];
        const activityModified = documentActivity
          ? documentActivity.sort(timeSort("modified", false))
          : null;
        const confirmedTime = activityModified
          ? activityModified?.[0].modified
          : null;
        confirmedTime && (elevatorInstallationProgress += 1);
      }
    });

    const result = (elevatorInstallationProgress / 14) * 100;
    return Math.round(result) + "%";
  }
};

export const projectProgress = (projectNumber, orders, orderActivities) => {
  const projectOrders = [];
  Object.keys(orders).forEach((item) => {
    orders[item].projectNumber === projectNumber && projectOrders.push(item);
  });
  const progressArray = [];
  projectOrders.forEach((item) => {
    let progress = orderProgress(orderActivities, item);

    progressArray.push(progress);
  });

  let sum = 0;

  progressArray.forEach((item) => {
    sum += item === "停工中" ? 0 : item;
  });
  const projectProgress = Math.ceil(sum / projectOrders.length);
  return projectProgress;
};

/**
    {
      "projectNo": "string",
      "orderNo": "string",
      "activityNo": "string",
      "type": 0,
      "date": "string",
      "combinePdf": true
    }
 */
export const setActivityStatusParams = (
  projectNo,
  orderNo,
  activityNo,
  date,
  type,
  orderActivities,
  orders
) => {
  const result = {};
  result.projectNo = projectNo;
  result.orderNo = orderNo;
  result.activityNo = activityNo;
  result.date = date;
  result.type = type;
  result.combinePdf = false;
  result.foe = orders?.[orderNo]?.fo;
  result.region = orders?.[orderNo]?.region;
  result.branch = orders?.[orderNo]?.prctr;

  if (orderActivities[orderNo + "-7030"]) {
    // 14 steps (or 9 steps)
    if (activityNo === "70C0") {
      result.combinePdf = true;
    }

    if (orderActivities[orderNo + "-" + activityNo].originalStep) {
      result.activityNo =
        orderActivities[orderNo + "-" + activityNo].originalStep;
    }
  }
  return result;
};

export const isInstallationStepEditable = (
  orderNo,
  activityNo,
  orderActivities
) => {
  if (
    orderActivities[orderNo + "-" + activityNo].editable === undefined ||
    orderActivities[orderNo + "-" + activityNo].editable
  ) {
    return true;
  } else {
    return false;
  }
};

export const calculationOfInstallationSteps = (orderActivities, orders) => {
  let handedOverToMaintenance = 0; //移交维保
  let debugQuantity = 0; // 调试
  let guideDoorInstallation = 0; //导轨门安装
  let startTheInstallation = 0; //开始安装
  let installationNotStarted = 0; //未开始安装
  const orderNos = Object.keys(orders);
  for (let i = 0; i < orderNos.length; i++) {
    if (
      orderActivities[orderNos[i] + "-7800"] &&
      orderActivities[orderNos[i] + "-7800"]?.confirmedDate
    ) {
      handedOverToMaintenance++;
    } else if (
      orderActivities[orderNos[i] + "-70C0"] &&
      orderActivities[orderNos[i] + "-70C0"]?.confirmedDate
    ) {
      debugQuantity++;
    } else if (
      orderActivities[orderNos[i] + "-7020"] &&
      orderActivities[orderNos[i] + "-7020"]?.confirmedDate
    ) {
      debugQuantity++;
    } else if (
      orderActivities[orderNos[i] + "-8010"] &&
      orderActivities[orderNos[i] + "-8010"]?.confirmedDate
    ) {
      guideDoorInstallation++;
    } else if (
      orderActivities[orderNos[i] + "-7700"] &&
      orderActivities[orderNos[i] + "-7700"]?.confirmedDate
    ) {
      startTheInstallation++;
    } else {
      installationNotStarted++;
    }
  }

  let theOverallProgress = 0;
  const data = [
    handedOverToMaintenance,
    debugQuantity,
    guideDoorInstallation,
    startTheInstallation,
    installationNotStarted,
  ];
  data.forEach((item) => {
    theOverallProgress += item;
  });

  return {
    handedOverToMaintenance,
    debugQuantity,
    guideDoorInstallation,
    startTheInstallation,
    installationNotStarted,
    theOverallProgress,
  };
};

export const currentRefreshTime = () => {
  return `${new Date().getMonth() + 1
    }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes()
    }`;
};

export const saveTheFirstRefreshTime = (dispatch) => {
  db.cache.get("dataRefreshTime").then((cache) => {
    const datatime = {
      allDataRefreshTime: currentRefreshTime(),
      masterDataRefreshTime: currentRefreshTime(),
      orderDataRefreshTime: currentRefreshTime(),
      templateListDataRefreshTime: currentRefreshTime(),
      documentListDataRefreshTime: currentRefreshTime(),
      taskListDataRefreshTime: currentRefreshTime(),
    };
    dispatch(action.setAllDataRefreshTime(datatime));

    !cache?.data &&
      db.cache
        .put({
          id: "dataRefreshTime",
          data: datatime,
        })
        .then(() => {
          dispatch(action.setAllDataRefreshTime(datatime));
        });
  });

  db.cache.get("settings").then((cache) => {
    const language = "zh-cn";
    !cache?.data &&
      db.cache
        .put({
          id: "settings",
          data: { language: "zh-cn" },
        })
        .then(() => {
          dispatch(action.setAllDataRefreshTime(language));
        });
  });
};

export const recordRefreshTime = (dispatch, name, projects, userInfo) => {
  if (name) {
    const parmas = {
      projectNos: Object.keys(projects),
    };

    const auth = JSON.parse(window.localStorage.getItem("auth"));
    let roles = auth?.roles;
    const isSubconTLOrPE = roles.indexOf('Subcon TL') > -1 || roles.indexOf('PE') > -1;
    const isEISV = roles.indexOf('SL') > -1;

    const request = getDocumentListParmas(parmas.projectNos);
    switch (name) {
      case "all":
        if (isSubconTLOrPE || isEISV) {
          dispatch(action.fetchOrders(request, "all", userInfo, dispatch));
        } else {
          dispatch(action.fetchOrders(request, "all", userInfo, dispatch));
          // dispatch(action.fetchDocuments(request, dispatch));
          dispatch(action.fetchTasksList(userInfo, dispatch));
        }
        break;
      case "orders":
        dispatch(action.fetchOrders(parmas, "", userInfo, dispatch));
        break;
      case "documents":
        dispatch(action.fetchDocuments(request, userInfo, dispatch));
        break;
      case "task":
        dispatch(action.fetchTasksList(request,userInfo,"", dispatch));
        break;
      default:
        return (
          dispatch(action.fetchOrders(request, "all", userInfo, dispatch)),
          // dispatch(action.fetchDocuments(dispatch)),
          dispatch(action.fetchTasksList(userInfo, dispatch))
        );
    }
  } else {
    db.cache.get("dataRefreshTime").then((cache) => {
      cache?.data && dispatch(action.setAllDataRefreshTime(cache.data));
    });
  }
};

export const getDocumentListParmas = (projectNos, orderNos) => {
  const orders = orderNos ? orderNos:  store.getState().orders;
  let data = [];
  for (let i = 0; i < projectNos.length; i++) {
    Object.keys(orders).find((item) => {
      return (
        orders[item].projectNumber === projectNos[i] &&
        data.push({
          foe: orders[item].fo,
          region: orders[item].region,
          branch: orders[item].prctr,
          projectNo: orders[item].projectNumber,
          orders: Object.keys(orders).filter((order) => {
            return orders[order].projectNumber === orders[item].projectNumber;
          }),
        })
      );
    });
  }

  return data;
};

export const isFormUpdated = (currentForm, initForm) => {
  if (currentForm.fields.length !== initForm.fields.length) {
    return false;
  }

  for (let i = 0; i < currentForm.fields.length; i++) {
    if (Array.isArray(currentForm.fields[i].settings.value)) {
      if (
        !_.isEqual(
          currentForm.fields[i].settings.value.sort(),
          initForm.fields[i].settings.value.sort()
        )
      ) {
        return true;
      }
    } else {
      if (
        currentForm.fields[i].settings.value !==
        initForm.fields[i].settings.value
      ) {
        return true;
      }
    }
  }

  return false;
};

export const localInstallationStepsConfirmDateProc = (data) => {
  const res = {};

  data.forEach((value) => {
    res[value.orderNo + "-" + value.stepNo] = value;
  });

  return res;
};

export const verifyWhenConfirm7020or70C0 = (
  orderActivities,
  orderNumber,
  activityNumber
) => {
  // 14 steps
  if (orderActivities[orderNumber + "-7030"]) {
    if (activityNumber === "70C0") {
      const checkSteps = [
        "7010",
        "7020",
        "7030",
        "7040",
        "7050",
        "7060",
        "7070",
        "7080",
        "7090",
        "70A0",
        "70B0",
      ];

      const result = checkSteps.find(
        (step) => !orderActivities[orderNumber + "-" + step].confirmedDate
      );

      if (result) {
        return {
          stepNo: result,
          message: "未确认,请先确认",
        };
      }
    }
  }
};

/**
 *  code: 1: 本地不存在template
 *        2：本地存在template,但是不一样
 *        3：本地存在template,但是一样
 */
export const checkTemplateForm = (documentNo, documentPart, value) => {
  const key = documentNo + "-" + documentPart;
  return db.cache.get("rawTemplateForm").then((cache) => {
    if (cache?.data) {
      const existData = cache.data;
      if (!existData[key]) {
        existData[key] = value;

        return db.cache
          .put({ id: "rawTemplateForm", data: existData })
          .then(() => {
            return Promise.resolve({ code: 1, value });
          });
      }

      if (existData[key] !== value) {
        existData[key] = value;

        return db.cache
          .put({ id: "rawTemplateForm", data: existData })
          .then(() => {
            return Promise.resolve({ code: 2, value });
          });
      }

      return Promise.resolve({ code: 3, value });
    } else {
      const data = {};
      data[key] = value;

      return db.cache.put({ id: "rawTemplateForm", data }).then(() => {
        return Promise.resolve({ code: 1, value });
      });
    }
  });
};

export const getRawTemplate = (documentNo, documentPart) => {
  const key = documentNo + "-" + documentPart;
  return db.cache.get("rawTemplateForm").then((cache) => {
    // TODO: 这边正常流程下来都会有数据，可提高代码健壮性
    if (cache?.data) {
      return Promise.resolve(cache.data[key]);
    }
  });
};

/**
 * code: 1: 本地存在draft
 *      2： 本地不存在draft
 */
export const getDraftFromLocal = (
  documentNo,
  documentPart,
  activityNo,
  productFamily,
  productLine,
  language,
  draftParam
) => {
  const { orderNo } = draftParam;
  const key =
    orderNo +
    "-" +
    activityNo +
    "-" +
    documentNo +
    "-" +
    documentPart +
    "-" +
    productFamily +
    "-" +
    productLine +
    "-" +
    language;
  return db.cache.get("templateDraft").then((cache) => {
    if (cache?.data) {
      const existData = cache.data;
      if (existData[key]) {
        return Promise.resolve({ code: 1, value: existData[key] });
      }

      return Promise.resolve({ code: 2 });
    } else {
      return Promise.resolve({ code: 2 });
    }
  });
};

/**
 * code： 1：draft 存在
 *        2：draft 不存在
 */
export const getDraft = (param, draftParam, expendParam) => {
  const { documentNo, documentPart } = param;
  const { activityNo, productFamily, productLine, language } = expendParam;
  return getDraftFromLocal(
    documentNo,
    documentPart,
    activityNo,
    productFamily,
    productLine,
    language,
    draftParam
  ).then((data) => {
    if (data.code === 1) {
      return Promise.resolve(data);
    } else
      return getDraftFromApi(draftParam).then((data) => {
        return Promise.resolve(data);
      });
  });
};

/**
 * code: 1 draft 存在
 *       2 draft 不存在
 */
export const getDraftFromApi = (draftParam) => {
  return api.getDraft(draftParam).then((res) => {
    if (res.data.form) {
      return Promise.resolve({ code: 1, value: res.data.form });
    } else {
      return Promise.resolve({ code: 2 });
    }
  });
};

export const saveDraftToLocal = (data, currentParam, draftParams) => {
  const { documentNo, documentPart } = currentParam;
  const { orderNo, activityNo, productFamily, productLine, language } =
    draftParams;
  const key =
    orderNo +
    "-" +
    activityNo +
    "-" +
    documentNo +
    "-" +
    documentPart +
    "-" +
    productFamily +
    "-" +
    productLine +
    "-" +
    language;
  db.cache.get("templateDraft").then((cache) => {
    if (cache?.data) {
      const existData = cache.data;
      existData[key] = data;
      db.cache.put({ id: "templateDraft", data: existData });
    } else {
      const storeData = {};
      storeData[key] = data;
      db.cache.put({ id: "templateDraft", data: storeData });
    }
  });
};

export const deleteDraftFromLocal = (currentParam) => {
  const { documentNo, documentPart } = currentParam;
  db.cache.get("templateDraft").then((cache) => {
    if (cache?.data) {
      const existData = cache.data;
      const deleteKeys = Object.keys(existData).filter((key) => {
        return key.includes(documentNo + "-" + documentPart);
      });

      deleteKeys.forEach((key) => {
        delete existData[key];
      });

      db.cache.put({ id: "templateDraft", data: existData });
    }
  });
};

export const getTemplateList = (templatesData, productLine, productFamily, productCategory) => {
  const condition1 = templatesData.filter(
    (item) =>
      item.productCategory === productCategory && item.productLine === productLine && item.productFamily === productFamily
  );

  const condition2 = templatesData.filter(
    (item) =>
      item.productCategory === productCategory && item.productLine === productLine && item.productFamily === null
  );

  const condition3 = templatesData.filter(
    (item) =>
      item.productCategory === productCategory && item.productFamily === productFamily && item.productLine === null
  );

  const condition4 = templatesData.filter(
    (item) =>
      item.productCategory === productCategory && item.productLine === null && item.productFamily === null
  );

  const condition5 = templatesData.filter(
    (item) =>
      item.productLine === productLine && item.productFamily === productFamily && item.productCategory === null
  );

  const condition6 = templatesData.filter(
    (item) =>
      item.productLine === productLine && item.productCategory === null && item.productFamily === null
  );

  const condition7 = templatesData.filter(
    (item) =>
      item.productFamily === productFamily && item.productCategory === null && item.productLine === null
  );

  const condition8 = templatesData.filter(
    (item) =>
      item.productCategory === null && item.productLine === null && item.productFamily === null
  );

  const result = [
    condition1,
    condition2,
    condition3,
    condition4,
    condition5,
    condition6,
    condition7,
    condition8
  ].find(array => array.length > 0)

  return result ? result : [];
};

export const getDocumentComplateStatus = (
  auth,
  projectNumber,
  orderNo,
  orderActivities,
  templates,
  documentList
) => {
  const activityList = publicFn.orderDetailSteps(
    orderActivities,
    orderNo,
    auth.activityAuth,
    auth.roles[0]
  );

  const documentCompleteStatus = [];
  for (let i = 0; i < activityList.length; i++) {
    if (orderActivities?.[orderNo + '-' + activityList[i]]) {
      const status = toDoOrDone(
        projectNumber,
        orderNo,
        activityList[i],
        templates,
        documentList
      );
      documentCompleteStatus.push(status);
    }

  }

  const completeSum = [];
  const completed = [];
  for (let i = 0; i < documentCompleteStatus.length; i++) {
    if (documentCompleteStatus[i] === "ToDo") {
      completeSum.push(documentCompleteStatus[i]);
    } else if (documentCompleteStatus[i] === "Done") {
      completeSum.push(documentCompleteStatus[i]);
      completed.push(documentCompleteStatus[i]);
    }
  }

  return `${completed.length}/${completeSum.length}`;
};

// export const getStopsOrHoistHeight = (chars, orderNo, type) => {
//   const condition = type === "stops" ? "GRP_NUMBER_OF_STOPS" : "GRP_HQ";

//   const data = [];
//   Object.keys(chars).filter((item) => {
//     return (
//       chars[item].orderNo === orderNo &&
//       chars[item].charID === condition &&
//       data.push(chars[item])
//     );
//   });
//   console.log(data, type, orderNo);

//   return data.length > 0 ? data[0].value : 0;
// };

export const getStopsOrHoistHeight = (chars, orderNo, type) => {
  const data = [];
  Object.keys(chars).filter((item) => {
    return chars[item].orderNo === orderNo && data.push(chars[item]);
  });

  if (type === "stops") {
    const stops = data.filter((item) => {
      return (
        item.name.indexOf("停站数") > -1 ||
        item.name.indexOf("Number of stops") > -1
      );
    });
    return stops.length > 0 ? stops[0].value : 0;
  } else {
    const hoistHeight = data.filter((item) => {
      return (
        item.name.indexOf("提升高度") > -1 ||
        item.name.indexOf("Travel height") > -1 ||
        item.name.indexOf("Vertical rise") > -1
      );
    });

    return hoistHeight.length > 0 ? hoistHeight[0].value : 0;
  }
};

export const scrollToPosition = (element, pathname) => {
  const position = store.getState().scrollPosition[pathname];
  element.current.scrollTop = position ? position : 0;
};

export const removeNotVisibleFields = (templateForm) => {
  const result = _.cloneDeep(templateForm);
  _.remove(result.fields, (field) => {
    return !isVisible(field);
  });
  return result;
};

export const getTaskCount = () => {
  const tasks = store.getState().tasks;
  const orders = store.getState().orders;
  const projects = store.getState().projects;

  const awaitCloseNum =
    publicFn.taskCleaner(tasks.assigner, orders, projects) &&
    publicFn.taskCleaner(tasks.assigner, orders, projects).filter((item) => {
      return item.Status === "D";
    }).length;

  const awaitComplateNum =
    publicFn.taskCleaner(tasks.assignee, orders, projects) &&
    publicFn.taskCleaner(tasks.assignee, orders, projects).filter((item) => {
      return item.Status === "A";
    }).length;

  return {
    awaitCloseNum,
    awaitComplateNum,
  };
};

export const getAwaitComplateAwaitCloseCount = (tasks) => {
  const countTaskStatuses = (tasks) => {
    const statusCount = {};
    tasks.forEach(task => {
      const { taskType, status } = task;
      if (!statusCount[taskType]) {
        statusCount[taskType] = { 'awaitStartNum': 0, "awaitCloseNum": 0, "awaitComplateNum": 0 };
      }
      if (status === "awaitClose") {
        statusCount[taskType]["awaitCloseNum"] += 1;
      } else if (status === "awaitComplate") {
        statusCount[taskType]["awaitComplateNum"] += 1;
      } else if (status === "awaitStart") {
        statusCount[taskType]["awaitStartNum"] += 1;
      }
    });

    return statusCount;
  };

  const taskStatusCount = countTaskStatuses(tasks);

  const updatedTasks = tasks.map(task => {
    const { taskType } = task;
    const { "awaitCloseNum": pendingCloseCount, "awaitComplateNum": pendingCompleteCount, 'awaitStartNum': pendingStartCoun } = taskStatusCount[taskType] || { "awaitCloseNum": 0, "awaitComplateNum": 0, 'awaitStartNum': 0 };

    return {
      ...task,
      "awaitCloseNum": pendingCloseCount,
      "awaitComplateNum": pendingCompleteCount,
      'awaitStartNum': pendingStartCoun
    };
  });
  return updatedTasks;
}

export const showNumberText = (min, max) => {
  const a = min === 0 ? min.toString() : min;
  const b = max === 0 ? max.toString() : max;

  if (a || b) {
    if (a && !b) {
      return `(${a}...)`;
    } else if (!a && b) {
      return `(...${b})`;
    } else {
      return `(${a}-${b})`;
    }
  } else {
    return "";
  }
};

export const checkFileIsExisting = (template, data, orders) => {
  const templateDataList = getTemplateList(
    template[data.activityNumber] || [],
    orders[data.orderNumber].productLine,
    orders[data.orderNumber].productFamily,
    orders[data.orderNumber].productCategory
  );

  const param = templateDataList.map((item) => {
    return {
      foe: orders[data.orderNumber].fo,
      region: orders[data.orderNumber].region,
      branch: orders[data.orderNumber].prctr,
      projectNo: orders[data.orderNumber].projectNumber,
      orderNo: data.orderNumber,
      activityNo: data.activityNumber,
      documentName: item.documentDescription + ".eform2",
    };
  });

  return api.checkFileIsExisting(param).then((res) => {
    let message = [];
    res.data.forEach((item, index) => {
      !item && message.push(templateDataList[index].documentDescription);
    });

    return message;
  });
};

export const getChecklistActivityNo = (data) => {
  const activtyNo = "V001";

  const listData =
    store.getState()?.documentList?.[data.projectNumber]?.[data.orderNumber]?.[
    activtyNo
    ];

  return listData ? activtyNo : false;
};


export const getNonConformityConfig = () => {
  return {
    "7010": {
      activityNo: "7010",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7020": {
      activityNo: "7020",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7030": {
      activityNo: "7030",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7040": {
      activityNo: "7040",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7050": {
      activityNo: "7050",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7060": {
      activityNo: "7060",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7070": {
      activityNo: "7070",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7080": {
      activityNo: "7080",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "7090": {
      activityNo: "7090",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "70A0": {
      activityNo: "70A0",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "70B0": {
      activityNo: "70B0",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "70C0": {
      activityNo: "70C0",
      allowreupload: true,
      closeEnabledInOILScreen: false
    },
    "70D0": {
      activityNo: "70D0",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7350": {
      activityNo: "7350",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7360": {
      activityNo: "7360",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7400": {
      activityNo: "7400",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7500": {
      activityNo: "7500",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7600": {
      activityNo: "7600",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7620": {
      activityNo: "7620",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7700": {
      activityNo: "7700",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7800": {
      activityNo: "7800",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "7950": {
      activityNo: "7950",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "8010": {
      activityNo: "8010",
      allowreupload: false,
      closeEnabledInOILScreen: true
    },
    "9200": {
      activityNo: "9200",
      allowreupload: false,
      closeEnabledInOILScreen: true
    }
  }
}

const customizer = (objValue, srcValue) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return objValue.concat(srcValue);
  }
};

export const updateOrdersData = (soNo, dispatch) => {
  dispatch(action.showLoading());
  api.fetchOrdersDataByProjects(soNo).then((response) => {
    const { entities } = normalize(response.data, schema.ordersData);
    db.cache.get("ordersData").then((cache) => {
      const result = _.mergeWith(cache.data, entities, customizer);
      let projects = result.projects
        ? Object.keys(result.projects)
        : [];
      db.cache.put({ id: "ordersData", data: result }).then(() => {
        const param = { projectNos: projects }
        repo
          .fetchLocalInstallationStepsConfirmDate(param)

        const request= getDocumentListParmas(param.projectNos, result?.orders)
        dispatch(action.fetchDocuments(request, {}, dispatch));
      });
    });


  }).catch((error) => {
    dispatch(action.setError(error.message));
  }).finally(() => {
    dispatch(action.hideLoading());
  });
}

export const disableForm = (params = {}) => {
  if (!showUploadButton()) {
    return false
  }

  const { orderActivities, documentList, templates, orders, auth, nonConformityConfig } = store.getState();
  const { activityNo, orderNo, productFamily, productLine, projectNumber, root } = params;
  const productCategory = orders[orderNo]?.productCategory;
  const templatesData = templates[activityNo] || [];
  const documents = [];
  const documentsItem = documentList[projectNumber]?.[orderNo]?.[activityNo];
  const allowreupload = nonConformityConfig[activityNo]?.allowreupload;
  const disableTheEntranceroot = root === "listCard";


  const data = getTemplateList(templatesData, productLine, productFamily, productCategory);
  const description = data.map((item) => {
    return item.documentDescription;
  });


  description.forEach((item) => {
    return (
      (documentsItem &&
        documentsItem.filter(
          (ele) => ele.name.indexOf(item) > -1 && documents.push(ele)
        )) ||
      []
    );
  });

  const docAuthActivityNos = documentAuthorizationC(
    orderActivities,
    orderNo,
    auth.activityAuth,
    auth.roles[0]
  );

  const canUploadDoc = docAuthActivityNos.includes(activityNo);

  if (root === "installationChecklist") {
    const template = {
      mandDoc: "Y",
      documentDescription: `安装检查清单`,
    };

    data.push(template);

    documents.push(documentList?.[projectNumber]?.[orderNo]?.[activityNo][0]);
  }

  if (disableTheEntranceroot && canUploadDoc) {
    return false
  }

  if (documents.length > 0) {
    if (!allowreupload) {
      return true
    } else {
      if (getChecklistActivityNo({ projectNumber: projectNumber, orderNumber: orderNo })) {
        return true
      } else {
        return false;
      }
    }
  } else {
    return false
  }
}

export const showUploadButton = () => {
  const {  auth } = store.getState();

  return auth?.isEnableCorrectImage
}

const getTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const getCurrentPosition =  () => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ status: 'success', data: { latitude, longitude } });
        },
        (error) => {
          resolve({ status: 'error', message: error.message });
        }
      );
    } else {
      resolve({ status: 'error', message: 'Geolocation is not supported by this browser.' });
    }
  });

};

// 根据经纬度获取详细地址
const getLocationFromCoordinates = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    if (window.BMap) {
      const geocoder = new window.BMap.Geocoder(); // 创建 Geocoder 实例
      const point = new window.BMap.Point(longitude, latitude); // 创建坐标对象

      geocoder.getLocation(point, (result) => {
        if (result) {
          resolve(result.address);
        } else {
          resolve('无法获取地址信息');
        }
      });
    } else {
      reject('百度地图 API 未加载');
    }
  });
};

export const fillTextToImg = async (base64, projectParams, isOnline) => {
  let data = store.getState();
  // let location = { longitude: "121.197237", latitude: "31.449172" }
  var address = "";
  if (isOnline) {
    const location = await getCurrentPosition();
    address = await getLocationFromCoordinates(location?.data?.latitude, location?.data?.longitude);
  };
  let projectName = data.projects[projectParams.projectNumber]?.description;
  let time = getTime();

  let watermarkText = [`拍摄地点：${address}`, `拍摄时间：${time}`, `订单编号：${projectParams.orderNo}`, `项目名称：${projectName}`];

  const img = new Image();
  img.src = base64;
  img.setAttribute("crossOrigin", "Anonymous");

  return new Promise((resolve) => {

    img.onload = () => {

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.font = '15px Arial';
      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";

      let lineHeight = 0;

      watermarkText.forEach(item => {
        lineHeight += 30
        ctx.fillText(item, 20, canvas.height - lineHeight + 20);
      })

      resolve(canvas.toDataURL("image/jpg"));
    };
  });
}

export const formatDateToYMD = (dateString) => {
  console.log(dateString)
  const date = new Date(dateString);  // 将字符串转换为 Date 对象

  const year = date.getFullYear();  // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 获取月份（注意月份是从0开始的，需加1）
  const day = String(date.getDate()).padStart(2, '0');  // 获取日期

  return dateString? `${year}-${month}-${day}`: null;  // 拼接成“YYYY年MM月DD日”格式
}

export const taskDataConversion = (item) => {
  let status;
  switch (item.status) {
    case 1:
      status = "awaitStart"
      break;
    case 2:
      status = "awaitComplate";
      break;
    case 3:
      status = "awaitClose";
      break;
    case 4:
      status = 'closed';
      break;
    case 5:
      status = 'closed';
      break;
    default:
      status = 'closed';
      break;
  };

  return {
    taskId: item.id,
    taskType: item.type,
    projectNo: item.projectNo,
    orderNo: item.salesOrderNo,
    activityNo: item.activityNo,
    projectName: item.projectName,
    planStartDate: formatDateToYMD(item.planStartDate),
    planEndDate: formatDateToYMD(item.planEndDate),
    actualStartDate: formatDateToYMD(item.actualStartDate),
    actualEndDate: formatDateToYMD(item.actualEndDate),
    actualCloseDate: formatDateToYMD(item.closedDate),
    statusDesc: item.statusDesc,
    status: status
  };

}

export const finishOrCloseCheck = (type, orderActivities, data, templates, orders, submit, activityParams) => {
  if (type === "close") {
    const result = verifyWhenConfirm7020or70C0(
      orderActivities,
      data.orderNo,
      data.activityNo
    );
    if (result) {
      alert(result.stepNo + result.message);
      return false;
    }
  };

  checkFileIsExisting(templates, {
    orderNumber: data.orderNo,
    activityNumber: data.activityNo
  }, orders).then((message) => {
    if (message.length < 1) {
      if (type === "close") {
        const templateDataList = getTemplateList(
          templates[data.activityNo] || [],
          orders[data.orderNo].productLine,
          orders[data.orderNo].productFamily,
          orders[data.orderNo].productCategory
        );

        const param = templateDataList.map((item) => {
          return {
            foe: orders[data.orderNo].fo,
            region: orders[data.orderNo].region,
            branch: orders[data.orderNo].prctr,
            ProjectNo: orders[data.orderNo].projectNumber,
            OrderNo: data.orderNo,
            ActivityNo: data.activityNo,
            Description: item.documentDescription,
          };
        });

       param.map(item =>
            store.dispatch(action.getNoConformityList(item)).then((res) => {
            const foundItems = res.data?.[0].nonConformities?.flatMap(key =>
              key.nonConformityItems.filter(
                subItem => subItem.itemValue === "no"
              )
              );
              if (foundItems.length > 0) {
                alert(`您有${foundItems.length}个不符合项未关闭，请点击已上传按钮进入查看&关闭不符合项界面关闭所有不符合项后，才能关闭任务`);
              return false;
            } else {
              submit(type, data, activityParams)
              }
          })
       )
      
      };
      type === 'finish' && submit(type, data, activityParams);
    } else {
      alert(`请点击待处理 上传 ${message.toString()}`);
      return false;
    }
  });
}