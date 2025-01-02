import { schema } from "normalizr";

export const activity = new schema.Entity(
  "activities",
  {},
  { idAttribute: "number" }
);

export const workCenter = new schema.Entity(
  "workCenters",
  {},
  {
    idAttribute: "projectNo",
  }
);

export const installation = new schema.Entity(
  "installations",
  {},
  {
    idAttribute: (value) => {
      return `${value.orderNumber}-${value.stepNumber}`;
    },
  }
);

export const orderInstallationMethod = new schema.Entity(
  "orderInstallationMethods",
  {},
  {
    idAttribute: "orderNumber",
  }
);

export const order = new schema.Entity(
  "orders",
  {
    installationMethod: orderInstallationMethod,
  },
  { idAttribute: "number" }
);

export const char = new schema.Entity(
  "chars",
  {},
  {
    idAttribute: (value) => {
      return `${value.orderNo}-${value.itemNo}-${value.charID}`;
    },
  }
);

export const orderActivity = new schema.Entity(
  "orderActivities",
  {},
  {
    idAttribute: (value) => {
      return `${value.orderNumber}-${value.activityNumber}`;
    },
  }
);

export const partnerFunction = new schema.Entity(
  "partnerFunctions",
  {},
  { idAttribute: "number" }
);

export const partner = new schema.Entity(
  "partners",
  {},
  {
    idAttribute: (value) => {
      return `${value.orderNumber}-${value.functionNumber}`;
    },
  }
);

export const productFamily = new schema.Entity(
  "productFamilies",
  {},
  { idAttribute: "productFamily" }
);

export const project = new schema.Entity(
  "projects",
  {},
  { idAttribute: "number" }
);

export const fittersDemand = new schema.Entity(
  "fittersDemand",
  {},
  { idAttribute: "productFamily" }
);

export const fittersDemands = [fittersDemand];

export const fittersCertification = new schema.Entity(
  "fittersCertification",
  {},
  { idAttribute: "sqmNr" }
);

export const fittersCertifications = [fittersCertification];

export const fittersAssignmentTransfer = new schema.Entity(
  "fittersAssignmentTransfer",
  {},
  { idAttribute: "projectNo" }
);

export const fittersAssignmentTransfers = [fittersAssignmentTransfer];

export const masterData = {
  activities: [activity],
  partnerFunctions: [partnerFunction],
  productFamilies: [productFamily],
  workCenters: [workCenter],
};

export const ordersData = {
  installations: [installation],
  orders: [order],
  orderActivities: [orderActivity],
  partners: [partner],
  projects: [project],
  chars: [char],
};
