import { toDoOrDone } from "js/util";
import {
  authorizationC,
  documentAuthorizationC,
  documentAuthorizationR,
} from "js/publicFn/authUtils";
const DateConfirmFlag = (flagNumber) => {
  const permissionObj = {
    CanConfirm: false,
    CanCancel: false,
    CanSetConstraint: false,
    CanDeleteDonstraint: false,
    HasConstraint: false,
    SupervisorActivity: false,
    HideActivity: false,
    PaymentOk: false,
    PaymentNotOk: false,
    ProgressType: false,
  };
  const binFlagNumberOrder = parseInt(flagNumber, 10)
    .toString(2)
    .padStart(10, "0")
    .split("")
    .reverse()
    .join("");
  Object.keys(permissionObj).forEach((item, index) => {
    if (binFlagNumberOrder[index] === "1") {
      permissionObj[item] = true;
    }
  });
  return permissionObj;
};

export const DatePermissionControl = (data, prarms) => {
  const { auth, orderActivities, documentList, templates } = data;
  const { orderNumber, activityNumber, projectNumber } = prarms;
  const role = auth.roles[0];
  const permissions = auth.activityAuth;
  const datePermission = {
    Confirm: false,
    Cancel: false,
    Lock: false,
    unLock: false,
    canUploadDoc: false,
    canReadDoc: false,
    docStatus: "",
    planedDateEditablePermission: false,
    planedDateCancelablePermission: false,
    finishedDateEditablePermission: false,
    finishedDateCancelablePermission: false,
  };

  const flagsNumber =
    orderActivities[`${orderNumber}-${activityNumber}`]?.flags;

  const docStatus = toDoOrDone(
    projectNumber,
    orderNumber,
    activityNumber,
    templates,
    documentList
  );

  const docIsFinish = docStatus !== "ToDo";

  const flags = DateConfirmFlag(flagsNumber);

  if (role === "admin") {
    Object.keys(datePermission).forEach((Permission) => {
      if (Permission === "Confirm") {
        if (docIsFinish) {
          datePermission[Permission] = true;
        }
      } else {
        datePermission[Permission] = true;
      }
      datePermission["docStatus"] = docStatus;
    });
  } else {
    const authNumbers = authorizationC(
      orderActivities,
      orderNumber,
      permissions,
      role
    );

    datePermission["docStatus"] = docStatus;

    if (authNumbers.includes(activityNumber)) {
      if (docIsFinish && flags.CanConfirm) {
        datePermission.Confirm = true;
      }

      datePermission.Cancel = flags.CanCancel;
      datePermission.Lock = flags.CanSetConstraint;
      datePermission.unLock = flags.CanDeleteDonstraint;

      datePermission.planedDateEditablePermission = flags.CanSetConstraint;
      datePermission.planedDateCancelablePermission = flags.CanDeleteDonstraint;
      datePermission.finishedDateEditablePermission = flags.CanConfirm;
      datePermission.finishedDateCancelablePermission = flags.CanCancel;
    }

    if (
      orderActivities[`${orderNumber}-${activityNumber}`].editable !==
        undefined &&
      orderActivities[`${orderNumber}-${activityNumber}`].editable === false
    ) {
      if (
        orderActivities[`${orderNumber}-${activityNumber}`].confirmedDate ===
        null
      ) {
        datePermission.Confirm = true;
        datePermission.Cancel = false;
      } else {
        datePermission.Confirm = false;
        datePermission.Cancel = true;
      }
    }

    if (!docIsFinish) {
      datePermission.Confirm = false;
    }

    const docCNumbers = documentAuthorizationC(
      orderActivities,
      orderNumber,
      permissions,
      role
    );

    if (docCNumbers.includes(activityNumber)) {
      datePermission.canUploadDoc = true;
    }

    const docRNumbers = documentAuthorizationR(
      orderActivities,
      orderNumber,
      permissions,
      role
    );

    if (docRNumbers.includes(activityNumber)) {
      datePermission.canReadDoc = true;
    }

  }

  return datePermission;
};
