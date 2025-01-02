export const searchBarFunction = (orders, searchCriteria) => {
  return !searchCriteria
    ? Object.keys(orders)
    : Object.keys(orders).filter((key) => {
        return (
          orders[key].number
            .toLowerCase()
            .indexOf(searchCriteria.toLowerCase()) > -1 ||
          orders[key].productFamily
            .toLowerCase()
            .indexOf(searchCriteria.toLowerCase()) > -1
        );
      });
};
