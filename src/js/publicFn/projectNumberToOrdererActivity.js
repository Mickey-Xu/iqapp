export const projectNumberToOrdererActivity = (data, ownProps) => {
  const { orderActivities, orders, orderInstallationMethods } = data;
  const { activityNumber, projectNumber } = ownProps;
  const installationMapping = {
    1: "Scaffold",
    2: "Scaffoldless",
    3: "Tirak",
    4: "Elevator",
  };
  return Object.keys(orders)
    .filter((order) => {
      return orders[order].projectNumber === projectNumber;
    })
    .map((order) => {
      const { installationMethod, number, productFamily } = orders[order];
      return Object.keys(orderActivities)
        .filter((orderActivitie) => {
          return activityNumber
            ? orderActivities[orderActivitie].orderNumber === number &&
                orderActivities[orderActivitie].activityNumber ===
                  activityNumber
            : orderActivities[orderActivitie].orderNumber === number;
        })
        .map((key) => {
          const { confirmedDate, leadingDate, orderNumber } = orderActivities[
            key
          ];
          return {
            Info: `${orderNumber}-"电梯号"-${productFamily}-${
              installationMapping[
                orderInstallationMethods[installationMethod].installationMethod
              ]
            }`,
            DocStatus: "Done",
            ConfirmDate: confirmedDate,
            PlanDate: leadingDate,
          };
        })[0];
    });
};
