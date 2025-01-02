import _ from "lodash";

export const showInActivityListSteps = (activityAuth, role) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    "SL":"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = showInActivityListSteps(activityAuth, key);
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const steps = Array.from(
    new Set([...authDesc.authorization.c, ...authDesc.documentAuthorization.c])
  );

  steps.forEach((step) => {
    result.push(...step.split("/"));
  });

  return result;
};

export const orderDetailSteps = (
  orderActivities,
  orderNumber,
  activityAuth,
  role
) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    "SL":"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = orderDetailSteps(
        orderActivities,
        orderNumber,
        activityAuth,
        key
      );
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const steps = Array.from(
    new Set([...authDesc.authorization.c, ...authDesc.documentAuthorization.c])
  );

  var filteredSteps = steps.filter((value) => {
    return value.length === 4;
  });

  if (role === "PE") {
    // 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      filteredSteps.push("7020");
    } else {
      // 14 steps
      filteredSteps.push("70D0");
    }
  } else if (role === "SL") {
    filteredSteps.push("7800");
   } else {
    // 3 steps
    // subcon tl:  remove 7020 when this order contains 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      const removeSteps = [
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
      ];

      _.remove(filteredSteps, (number) => {
        return removeSteps.includes(number);
      });
    }
  }
  return [...new Set(filteredSteps)];
};

export const allActivitiesNosInProjectProgress = (activityAuth, role) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    SL:"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = allActivitiesNosInProjectProgress(activityAuth, role);
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const authActivities = Array.from(
    new Set([...authDesc.authorization.c, ...authDesc.authorization.r])
  );

  var filteredActivities = authActivities.filter((value) => {
    return value.length === 4;
  });

  const installationSteps = [
    "7000",
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

  filteredActivities = filteredActivities.filter(
    (value) => !installationSteps.includes(value)
  );

  return filteredActivities;
};

export const allOrderDetailSteps = (
  orderActivities,
  orderNumber,
  activityAuth,
  role
) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    "SL":"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = allOrderDetailSteps(
        orderActivities,
        orderNumber,
        activityAuth,
        key
      );
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const steps = Array.from(
    new Set([
      ...authDesc.authorization.c,
      ...authDesc.documentAuthorization.c,
      ...authDesc.authorization.r,
      ...authDesc.documentAuthorization.r,
    ])
  );

  var filteredSteps = steps.filter((value) => {
    return value.length === 4;
  });

  if (role === "PE") {
    // 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      filteredSteps.push("7020");
    } else {
      // 14 steps
      filteredSteps.push("70D0");
    }
  } else if (role === "SL") {
    filteredSteps.push("7800");
  } else {
    // 3 steps
    // subcon tl:  remove 7020 when this order contains 3 steps
    // add 7020/70D0
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      const removeSteps = [
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
      ];

      _.remove(filteredSteps, (number) => {
        return removeSteps.includes(number);
      });
    } else {
      // 14 steps
      filteredSteps.push("70D0");
    }
  }

  return Array.from(new Set([...filteredSteps]));
};

export const authorizationC = (
  orderActivities,
  orderNumber,
  activityAuth,
  role
) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    SL:"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = authorizationC(
        orderActivities,
        orderNumber,
        activityAuth,
        key
      );
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const steps = Array.from(new Set([...authDesc.authorization.c]));

  var filteredSteps = steps.filter((value) => {
    return value.length === 4;
  });

  if (role === "PE") {
    // 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      filteredSteps.push("7020");
    } else {
      // 14 steps
      filteredSteps.push("70D0");
    }
  } else {
    // 3 steps
    // subcon tl:  remove 7020 when this order contains 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      const removeSteps = [
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
      ];

      _.remove(filteredSteps, (number) => {
        return removeSteps.includes(number);
      });
    }
  }

  return [...new Set(filteredSteps)];
};

export const documentAuthorizationC = (
  orderActivities,
  orderNumber,
  activityAuth,
  role
) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    "SL":"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = documentAuthorizationC(
        orderActivities,
        orderNumber,
        activityAuth,
        key
      );
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const steps = Array.from(new Set([...authDesc.documentAuthorization.c]));

  var filteredSteps = steps.filter((value) => {
    return value.length === 4;
  });

  if (role === "PE") {
    // 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      filteredSteps.push("7020");
    } else {
      // 14 steps
      filteredSteps.push("70D0");
    }
  } else if (role === "SL") {
    filteredSteps.push("7800");
  } else {
    // 3 steps
    // subcon tl:  remove 7020 when this order contains 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      const removeSteps = [
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
      ];

      _.remove(filteredSteps, (number) => {
        return removeSteps.includes(number);
      });
    }
  }

  return [...new Set(filteredSteps)];
};

export const documentAuthorizationR = (
  orderActivities,
  orderNumber,
  activityAuth,
  role
) => {
  const rolesMapper = {
    PE: "pe",
    "Subcon TL": "subconTL",
    "SL":"sl"
  };

  const result = [];

  if (role === "admin") {
    Object.keys(rolesMapper).forEach((key) => {
      const tmp = documentAuthorizationR(
        orderActivities,
        orderNumber,
        activityAuth,
        key
      );
      result.push(...tmp);
    });

    return Array.from(new Set([...result]));
  }

  const authDesc = activityAuth[rolesMapper[role]];

  const steps = Array.from(
    new Set([
      ...authDesc.documentAuthorization.c,
      ...authDesc.documentAuthorization.r,
    ])
  );

  var filteredSteps = steps.filter((value) => {
    return value.length === 4;
  });

  if (role === "PE") {
    // 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      filteredSteps.push("7020");
    } else {
      // 14 steps
      filteredSteps.push("70D0");
    }
  } else if (role === "SL") {
    filteredSteps.push("7800");
  } else {
    // 3 steps
    // subcon tl:  remove 7020 when this order contains 3 steps
    if (
      orderActivities[orderNumber + "-7020"] &&
      !orderActivities[orderNumber + "-7030"]
    ) {
      const removeSteps = [
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
      ];

      _.remove(filteredSteps, (number) => {
        return removeSteps.includes(number);
      });
    }
  }
  return [...new Set(filteredSteps)];
};
