export const activities = [
  {
    number: "7000",
    description: "activity 7000",
  },
  {
    number: "7100",
    description: "activity 7100",
  },
  {
    number: "7200",
    description: "activity 7200",
  },
  {
    number: "7700",
    description: "activity 7700",
  },
  {
    number: "8010",
    description: "activity 8010",
  },
  {
    number: "7020",
    description: "activity 7020",
  },
  {
    number: "7070",
    description: "activity 7070",
  },
  {
    number: "70C0",
    description: "activity 70C0",
  },
  {
    number: "7800",
    description: "activity 7800",
  },
  {
    number: "7720",
    description: "activity 7720",
  },
];

export const auth = {
  firstName: "John",
  lastName: "Smith",
  role: "PE",
};

export const partnerFunctions = [
  {
    number: "3001",
    name: "YS",
  },
  {
    number: "3002",
    name: "YS",
  },
  {
    number: "3003",
    name: "XS",
  },
];

export const partners = [
  {
    number: "5001",
    orderNumber: "11783033-L1",
    functionNumber: "3001",
    siteAddress: "北京市大兴区瀛海镇XXX路",
  },
  {
    number: "5002",
    orderNumber: "11783033-L2",
    functionNumber: "3001",
    siteAddress: "北京市大兴区瀛海镇XXX路",
  },
  {
    number: "5003",
    orderNumber: "11783033-L2",
    functionNumber: "3003",
    siteAddress: "北京市大兴区XXX路",
  },
  {
    number: "5004",
    orderNumber: "11783033-L2",
    functionNumber: "3002",
    siteAddress: "北京市大兴区XXX路",
  },
];

export const installations = [
  {
    orderNumber: "11783033-L1",
    stepNumber: "71C0",
    description: "installation 1",
  },
  {
    orderNumber: "11783033-L1",
    stepNumber: "71D0",
    description: "installation 2",
  },
  {
    orderNumber: "11783033-L1",
    stepNumber: "71E0",
    description: "installation 3",
  },
  {
    orderNumber: "11783033-L2",
    stepNumber: "71C0",
    description: "installation 1",
  },
  {
    orderNumber: "11783033-L2",
    stepNumber: "71D0",
    description: "installation 2",
  },
  {
    orderNumber: "11783033-L2",
    stepNumber: "71E0",
    description: "installation 3",
  },
];

export const orders = [
  {
    number: "11783033-L1",
    projectNumber: "1000",
    productFamily: "9300-AE",
    installationMethod: "scaffold",
  },
  {
    number: "11783033-L2",
    projectNumber: "1000",
    productFamily: "9300-AE",
    installationMethod: "scaffold",
  },
  {
    number: "11783033-L1",
    projectNumber: "1000",
    productFamily: "9300-AE",
    installationMethod: "scaffold",
  },
  {
    number: "11783033-L2",
    projectNumber: "1001",
    productFamily: "Schindler 3300",
    installationMethod: "scaffoldless",
  },
  {
    number: "11783033-L3",
    projectNumber: "1001",
    productFamily: "Schindler 5500",
    installationMethod: "escalator",
  },
  {
    number: "11783033-L4",
    projectNumber: "1001",
    productFamily: "Schindler 7700",
    installationMethod: "escalator",
  },
];

export const orderActivities = [
  {
    orderNumber: "11783033-L1",
    activityNumber: "7000",
    confirmedDate: new Date(2020, 7, 25, 0, 0, 0, 0),
    leadingDate: new Date(2020, 7, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L1",
    activityNumber: "7100",
    confirmedDate: new Date(2020, 7, 24, 0, 0, 0, 0),
    leadingDate: new Date(2020, 11, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L1",
    activityNumber: "7200",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 7, 23, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L2",
    activityNumber: "7100",
    confirmedDate: new Date(2020, 7, 25, 0, 0, 0, 0),
    leadingDate: new Date(2020, 7, 24, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L2",
    activityNumber: "7200",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 20, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L2",
    activityNumber: "7700",
    confirmedDate: "",
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7700",
    confirmedDate: new Date(2020, 9, 15, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "8010",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "70C0",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7070",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7020",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "70C0",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7070",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7800",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7720",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "7020",
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 9, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L3",
    activityNumber: "71C0",
    progress: 60,
    confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 7, 31, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 7, 31, 0, 0, 0, 0),
    leadingEndDate: new Date(2020, 7, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L4",
    activityNumber: "7700",
    progress: 90,
    // confirmedDate: new Date(2020, 7, 1, 0, 0, 0, 0),
    leadingDate: new Date(2020, 7, 31, 0, 0, 0, 0),
  },
  {
    orderNumber: "11783033-L1",
    activityNumber: "71C0",
    leadingDate: new Date(2020, 8, 1, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 8, 1),
    leadingEndDate: new Date(2020, 8, 2),
  },
  {
    orderNumber: "11783033-L1",
    activityNumber: "71D0",
    leadingDate: new Date(2020, 8, 1, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 8, 1),
    leadingEndDate: new Date(2020, 8, 2),
  },
  {
    orderNumber: "11783033-L1",
    activityNumber: "71E0",
    leadingDate: new Date(2020, 8, 1, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 8, 1),
    leadingEndDate: new Date(2020, 8, 2),
  },
  {
    orderNumber: "11783033-L2",
    activityNumber: "71C0",
    leadingDate: new Date(2020, 8, 1, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 8, 1),
    leadingEndDate: new Date(2020, 8, 2),
  },
  {
    orderNumber: "11783033-L2",
    activityNumber: "71D0",
    leadingDate: new Date(2020, 8, 1, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 8, 1),
    leadingEndDate: new Date(2020, 8, 2),
  },
  {
    orderNumber: "11783033-L2",
    activityNumber: "71E0",
    leadingDate: new Date(2020, 8, 1, 0, 0, 0, 0),
    leadingStartDate: new Date(2020, 8, 1),
    leadingEndDate: new Date(2020, 8, 2),
  },
];

export const projects = [
  {
    number: "1000",
    name: "大兴瀛海镇旭辉自商房电梯项目",
    teamLeader: "阿水",
  },
  {
    number: "1001",
    name: "亦城时代广场A181",
    teamLeader: "阿水",
  },
];


export const taskList = [
  {
    "id": "T1005",
    "type": "COMM",
    "salesOrderNo": "19083397",
    "activityNo": "111",
    "projectNo": "12345",
    "projectName": "Project A",
    "planStartDate": "2024-02-01T09:00:00",
    "planEndDate": "2024-02-01T12:00:00",
    "actualStartDate": "2024-02-01T09:15:00",
    "actualEndDate": "2024-02-01T11:45:00",
    "actualClosedDate": "2024-02-01T12:15:00",
    "status": "1",
    "statusDesc": "已开始"
  },
  {
    "id": "T1006",
    "type": "OVER_LOAD",
    "salesOrderNo": "19083398",
    "activityNo": "112",
    "projectNo": "23456",
    "projectName": "Project B",
    "planStartDate": "2024-03-05T08:00:00",
    "planEndDate": "2024-03-05T16:00:00",
    "actualStartDate": "2024-03-05T08:00:00",
    "actualEndDate": "2024-03-05T15:30:00",
    "actualClosedDate": "2024-03-05T16:00:00",
    "status": "2",
    "statusDesc": "已完成"
  },
  {
    "id": "T1007",
    "type": "PQC",
    "salesOrderNo": "19083399",
    "activityNo": "113",
    "projectNo": "34567",
    "projectName": "Project C",
    "planStartDate": "2024-04-10T14:00:00",
    "planEndDate": "2024-04-10T18:00:00",
    "actualStartDate": "2024-04-10T14:30:00",
    "actualEndDate": "2024-04-10T17:45:00",
    "actualClosedDate": "2024-04-10T18:30:00",
    "status": "3",
    "statusDesc": "新建"
  },
  {
    "id": "T1008",
    "type": "COMM",
    "salesOrderNo": "19083406",
    "activityNo": "114",
    "projectNo": "45678",
    "projectName": "Project D",
    "planStartDate": "2024-05-15T11:00:00",
    "planEndDate": "2024-05-15T14:00:00",
    "actualStartDate": "2024-05-15T11:05:00",
    "actualEndDate": "2024-05-15T13:55:00",
    "actualClosedDate": "2024-05-15T14:10:00",
    "status": "3",
    "statusDesc": "已关闭"
  },
  {
    "id": "T1009",
    "type": "OVER_LOAD",
    "salesOrderNo": "19083408",
    "activityNo": "115",
    "projectNo": "56789",
    "projectName": "Project E",
    "planStartDate": "2024-06-01T13:00:00",
    "planEndDate": "2024-06-01T18:00:00",
    "actualStartDate": "2024-06-01T13:15:00",
    "actualEndDate": "2024-06-01T17:30:00",
    "actualClosedDate": "2024-06-01T18:00:00",
    "status": "1",
    "statusDesc": "已完成"
  }
]
