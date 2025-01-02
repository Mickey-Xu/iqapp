export const stepSplit = (data) => {
  const setpMapping = {
    7010: {
      7010: { description: "开箱检查及仓储" },
      7020: { description: "安装起吊设备" },
    },
    7020: { 7030: { description: "安装前的检查工作" } },
    7030: {
      7040: { description: "安装底坑部件" },
      7050: { description: "安装轿厢部件" },
      7060: { description: "安装导轨、支架" },
    },
    7040: { 7070: { description: "安装顶部部件及曳引机检查" } },
    7050: {
      7080: { description: "安装曳引媒介" },
      7090: { description: "安装轿门地坎和厅门" },
    },
    7060: {
      "70A0": { description: "	井道和地坑接线" },
      "70B0": { description: "轿厢竣工检查" },
    },
    7070: { "70C0": { description: "调试前最终任务检查" } },
    7080: { "70D0": { description: "调试	" } },
    7600: { 7600: { description: "配合SAIS检查	" } },
  };
  const installationData = [];
  let isLastStep = false;
  data.forEach((stepObj) => {
    Object.keys(setpMapping[stepObj.stepNumber]).forEach(
      (fourTeenStep, index) => {
        if (Object.keys(setpMapping[stepObj.stepNumber]).length - 1 === index) {
          isLastStep = true;
        } else {
          isLastStep = false;
        }
        const nineStepNumber = stepObj.stepNumber;
        installationData.push({
          ...stepObj,
          stepNumber: fourTeenStep,
          description:
            setpMapping[stepObj.stepNumber][fourTeenStep].description,
          isLastStep,
          nineStepNumber,
        });
      }
    );
  });
  return installationData;
};
