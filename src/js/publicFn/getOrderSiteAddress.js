export const getProjectSiteAddress = (data, params) => {
  const { orders, partners } = data;
  const { projectNumber } = params;

  const getOrderSiteAddress = (orderNumber) => {
    const firstPartner = Object.keys(partners)
      .filter((key) => {
        return (
          partners[key].orderNumber === orderNumber &&
          partners[key].functionNumber === "YS"
        );
      })
      .sort()[0];

    if (firstPartner) {
      return partners[firstPartner]?.siteAddress;
    }
    return null;
  };

  if (Object.keys(orders).length > 0) {
    let result = Object.keys(orders)
      .filter((orderNumber) => {
        return orders[orderNumber].projectNumber === projectNumber;
      })
      .sort()
      .map((orderNumber) => {
        return {
          orderNumber,
          siteAddress: getOrderSiteAddress(orderNumber),
        };
      })
      .filter((item) => {
        return !!item.siteAddress;
      })[0];
    return result ? result.siteAddress : "";
  }
  return "";
};
