export const stepDescription = {
  7010: "开箱检查及仓储",
  7020: "安装起吊设备",
  7030: "安装前的检查工作",
  7040: "安装底坑部件",
  7050: "安装轿厢部件",
  7060: "安装导轨、支架",
  7070: "安装顶部部件及曳引机检查",
  7080: "安装曳引媒介",
  7090: "安装轿门地坎和厅门",
  "70A0": "井道和地坑接线",
  "70B0": "轿厢竣工检查",
  "70C0": "调试前最终任务检查",
  "70D0": "调试",
  7600: "配合SAIS检查",
};

export const nineStepsToFourteen = (data) => {
  if (Object.keys(data).length === 0) {
    return data;
  }
  const orders = new Set(
    Object.values(data.installations).map((v) => {
      return v.orderNumber;
    })
  );
  orders.forEach((order) => {
    // check 9 step
    if (
      data.installations[order + "-7080"] &&
      !data.installations[order + "-7090"]
    ) {
      // 7600 -> 7600
      data.installations[order + "-7600"] = {
        orderNumber: order,
        stepNumber: "7600",
        description: stepDescription["7600"],
      };

      // 7080 -> 70C0 & 70D0
      data.installations[order + "-70C0"] = {
        orderNumber: order,
        stepNumber: "70C0",
        description: stepDescription["70C0"],
      };
      data.installations[order + "-70D0"] = {
        orderNumber: order,
        stepNumber: "70D0",
        description: stepDescription["70D0"],
      };

      // 7070 -> 70B0
      data.installations[order + "-70B0"] = {
        orderNumber: order,
        stepNumber: "70B0",
        description: stepDescription["70B0"],
      };

      // 7060 -> 70A0
      data.installations[order + "-70A0"] = {
        orderNumber: order,
        stepNumber: "70A0",
        description: stepDescription["70A0"],
      };

      // 7050 -> 7080 & 7090
      data.installations[order + "-7080"] = {
        orderNumber: order,
        stepNumber: "7080",
        description: stepDescription["7080"],
      };
      data.installations[order + "-7090"] = {
        orderNumber: order,
        stepNumber: "7090",
        description: stepDescription["7090"],
      };

      data.installations[order + "-7070"] = {
        orderNumber: order,
        stepNumber: "7070",
        description: stepDescription["7070"],
      };

      // 7030 -> 7040 & 7050 & 7060
      data.installations[order + "-7040"] = {
        orderNumber: order,
        stepNumber: "7040",
        description: stepDescription["7040"],
      };
      data.installations[order + "-7050"] = {
        orderNumber: order,
        stepNumber: "7050",
        description: stepDescription["7050"],
      };
      data.installations[order + "-7060"] = {
        orderNumber: order,
        stepNumber: "7060",
        description: stepDescription["7060"],
      };

      // 7020 -> 7030
      data.installations[order + "-7030"] = {
        orderNumber: order,
        stepNumber: "7030",
        description: stepDescription["7030"],
      };

      // 7010 -> 7010 & 7020
      data.installations[order + "-7010"] = {
        orderNumber: order,
        stepNumber: "7010",
        description: stepDescription["7010"],
      };
      data.installations[order + "-7020"] = {
        orderNumber: order,
        stepNumber: "7020",
        description: stepDescription["7020"],
      };

      updateActivitiesData(data, order);
    }
  });

  return data;
};

export const activityStatusSetNineStepsToFourteen = (data) => {
  if (Object.keys(data).length === 0) {
    return data;
  }
  const orders = new Set(
    Object.values(data.orderActivities).map((v) => {
      return v.orderNumber;
    })
  );

  orders.forEach((order) => {
    if (
      data.orderActivities[order + "-7080"] &&
      !data.orderActivities[order + "-7090"]
    ) {
      updateActivitiesData(data, order);
    }
  });

  return data;
};

const updateActivitiesData = (data, order) => {
  // 7600 -> 7600
  data.orderActivities[order + "-7600"].originalStep = "7600";
  data.orderActivities[order + "-7600"].editable = true;

  // 7080 -> 70D0
  const activity7080 = data.orderActivities[order + "-7080"];
  data.orderActivities[order + "-70D0"] = { ...activity7080 };
  data.orderActivities[order + "-70D0"].activityNumber = "70D0";
  data.orderActivities[order + "-70D0"].originalStep = "7080";
  data.orderActivities[order + "-70D0"].editable = true;
  data.orderActivities[order + "-70D0"].sort = 253;

  // 7070 -> 70C0
  const activity7070 = data.orderActivities[order + "-7070"];
  data.orderActivities[order + "-70C0"] = { ...activity7070 };
  data.orderActivities[order + "-70C0"].activityNumber = "70C0";
  data.orderActivities[order + "-70C0"].originalStep = "7070";
  data.orderActivities[order + "-70C0"].editable = true;
  data.orderActivities[order + "-70C0"].sort = 252;

  // 7060 -> 70A0 & 70B0
  const activity7060 = data.orderActivities[order + "-7060"];
  data.orderActivities[order + "-70A0"] = { ...activity7060 };
  data.orderActivities[order + "-70A0"].activityNumber = "70A0";
  data.orderActivities[order + "-70A0"].confirmedDate = null;
  data.orderActivities[order + "-70A0"].sort = 250;
  data.orderActivities[order + "-70B0"] = { ...activity7060 };
  data.orderActivities[order + "-70B0"].activityNumber = "70B0";
  data.orderActivities[order + "-70B0"].originalStep = "7060";
  data.orderActivities[order + "-70B0"].editable = true;
  data.orderActivities[order + "-70B0"].sort = 251;

  // 7050 -> 7080 & 7090
  const activity7050 = data.orderActivities[order + "-7050"];
  data.orderActivities[order + "-7080"] = { ...activity7050 };
  data.orderActivities[order + "-7080"].activityNumber = "7080";
  data.orderActivities[order + "-7080"].confirmedDate = null;
  data.orderActivities[order + "-7080"].sort = 248;
  data.orderActivities[order + "-7090"] = { ...activity7050 };
  data.orderActivities[order + "-7090"].activityNumber = "7090";
  data.orderActivities[order + "-7090"].originalStep = "7050";
  data.orderActivities[order + "-7090"].editable = true;
  data.orderActivities[order + "-7090"].sort = 249;

  // 7040 -> 7070
  const activity7040 = data.orderActivities[order + "-7040"];
  data.orderActivities[order + "-7070"] = { ...activity7040 };
  data.orderActivities[order + "-7070"].activityNumber = "7070";
  data.orderActivities[order + "-7070"].originalStep = "7040";
  data.orderActivities[order + "-7070"].editable = true;
  data.orderActivities[order + "-7070"].sort = 247;

  // 7030 -> 7040 & 7050 & 7060
  const activity7030 = data.orderActivities[order + "-7030"];
  data.orderActivities[order + "-7040"] = { ...activity7030 };
  data.orderActivities[order + "-7040"].activityNumber = "7040";
  data.orderActivities[order + "-7040"].confirmedDate = null;
  data.orderActivities[order + "-7040"].sort = 244;
  data.orderActivities[order + "-7050"] = { ...activity7030 };
  data.orderActivities[order + "-7050"].activityNumber = "7050";
  data.orderActivities[order + "-7050"].confirmedDate = null;
  data.orderActivities[order + "-7050"].sort = 245;
  data.orderActivities[order + "-7060"] = { ...activity7030 };
  data.orderActivities[order + "-7060"].activityNumber = "7060";
  data.orderActivities[order + "-7060"].originalStep = "7030";
  data.orderActivities[order + "-7060"].editable = true;
  data.orderActivities[order + "-7060"].sort = 246;

  // 7020 -> 7030
  const activity7020 = data.orderActivities[order + "-7020"];
  data.orderActivities[order + "-7030"] = { ...activity7020 };
  data.orderActivities[order + "-7030"].activityNumber = "7030";
  data.orderActivities[order + "-7030"].originalStep = "7020";
  data.orderActivities[order + "-7030"].editable = true;
  data.orderActivities[order + "-7030"].sort = 243;

  // 7010 -> 7010 & 7020
  const activity7010 = data.orderActivities[order + "-7010"];
  data.orderActivities[order + "-7010"] = { ...activity7010 };
  data.orderActivities[order + "-7010"].activityNumber = "7010";
  data.orderActivities[order + "-7010"].confirmedDate = null;
  data.orderActivities[order + "-7010"].sort = 241;
  data.orderActivities[order + "-7020"] = { ...activity7010 };
  data.orderActivities[order + "-7020"].activityNumber = "7020";
  data.orderActivities[order + "-7020"].originalStep = "7010";
  data.orderActivities[order + "-7020"].editable = true;
  data.orderActivities[order + "-7020"].sort = 242;
};

export const addActivityStepEditable = (data) => {
  if (Object.keys(data).length === 0) {
    return data;
  }
  const orders = new Set(
    Object.values(data.orderActivities).map((v) => {
      return v.orderNumber;
    })
  );

  orders.forEach((order) => {
    if (
      data.orderActivities[order + "-7080"] &&
      !data.orderActivities[order + "-7090"]
    ) {
      // 9 steps
      const steps9 = [
        "7010",
        "7020",
        "7030",
        "7040",
        "7050",
        "7060",
        "7070",
        "7080",
        "7600",
      ];
      steps9.forEach(r=>{
        if(Object.keys(data.orderActivities).indexOf(order+'-'+r)<0){
          alert("订单"+order+"缺少步骤"+r+"的配置信息。");
        }
      })
      steps9.forEach((step) => {
        data.orderActivities[order + "-" + step].editable = false;
      });
    } else if (
      data.orderActivities[order + "-7020"] &&
      !data.orderActivities[order + "-7030"]
    ) {
      // 3 steps
      const steps3 = ["7010", "7020", "7600"];
      steps3.forEach(r=>{
        if(Object.keys(data.orderActivities).indexOf(order+'-'+r)<0){
          alert("订单"+order+"缺少步骤"+r+"的配置信息。");
        }
      })
      steps3.forEach((step) => {
        data.orderActivities[order + "-" + step].editable = true;
      });
    } else if (
      data.orderActivities[order + "-7010"] &&
      data.orderActivities[order + "-7020"] &&
      data.orderActivities[order + "-7030"] &&
      data.orderActivities[order + "-7040"] &&
      data.orderActivities[order + "-7050"] &&
      data.orderActivities[order + "-7060"] &&
      data.orderActivities[order + "-7070"] &&
      data.orderActivities[order + "-7080"] &&
      data.orderActivities[order + "-7090"] &&
      data.orderActivities[order + "-70A0"] &&
      data.orderActivities[order + "-70B0"] &&
      data.orderActivities[order + "-70C0"] &&
      data.orderActivities[order + "-70D0"] &&
      data.orderActivities[order + "-7600"]
    ) {
      // 14 steps
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
      steps14.forEach(r=>{
        if(Object.keys(data.orderActivities).indexOf(order+'-'+r)<0){
          alert("订单"+order+"缺少步骤"+r+"的配置信息。");
        }
      })
      steps14.forEach((step) => {
        data.orderActivities[order + "-" + step].editable = true;
      });
    }
  });

  return data;
};

export const updateInstallationStepDesc = (data) => {
  data.activities["7010"].descriptionShort3 =
    data.activities["7010"].descriptionShort;
  data.activities["7010"].descriptionShort14 = stepDescription["7010"];

  data.activities["7020"].descriptionShort3 =
    data.activities["7020"].descriptionShort;
  data.activities["7020"].descriptionShort14 = stepDescription["7020"];

  const steps = [
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

  steps.forEach((step) => {
    if (!data.activities[step]) {
      data.activities[step] = { number: step };
    }
  });

  data.activities["7030"].descriptionShort = stepDescription["7030"];
  data.activities["7030"].sort = 243;
  data.activities["7040"].descriptionShort = stepDescription["7040"];
  data.activities["7040"].sort = 244;
  data.activities["7050"].descriptionShort = stepDescription["7050"];
  data.activities["7050"].sort = 245;
  data.activities["7060"].descriptionShort = stepDescription["7060"];
  data.activities["7060"].sort = 246;
  data.activities["7070"].descriptionShort = stepDescription["7070"];
  data.activities["7070"].sort = 247;
  data.activities["7080"].descriptionShort = stepDescription["7080"];
  data.activities["7080"].sort = 248;
  data.activities["7090"].descriptionShort = stepDescription["7090"];
  data.activities["7090"].sort = 249;
  data.activities["70A0"].descriptionShort = stepDescription["70A0"];
  data.activities["70A0"].sort = 250;
  data.activities["70B0"].descriptionShort = stepDescription["70B0"];
  data.activities["70B0"].sort = 251;
  data.activities["70C0"].descriptionShort = stepDescription["70C0"];
  data.activities["70C0"].sort = 252;
  data.activities["70D0"].descriptionShort = stepDescription["70D0"];
  data.activities["70D0"].sort = 253;
  data.activities["7600"].descriptionShort = stepDescription["7600"];
  data.activities["7600"].sort = 278;

  return data;
};

export const isInstallationStep = (activityNo) => {
  const steps = [
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

  return steps.includes(activityNo);
};
