import List from "@material-ui/core/List";
import OrderListItem from "components/OrderListItem";
import * as util from "js/util";
import React from "react";
import { connect } from "react-redux";

const OrderList = ({ orderActivities, pendingList }) => {
  return (
    <List
      style={{
        position: "absolute",
        backgroundColor: "#f3f3f3",
        height: `calc(100%- 173px)`,
        width: "100%",
        overflow: "hidden auto",
      }}
    >
      {orderActivities.map((item) => {
        return (
          <OrderListItem key={item} number={item} pendingList={pendingList} />
        );
      })}
    </List>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { orderActivities, overdueActivities, timeHorizon } = state;
  const { activityNumber, activityStatus } = ownProps;
  const today = new Date().setHours(0, 0, 0, 0);

  let overdueList = [];
  let pendingList = [];
  let confirmList = [];
  let currentActivityOverdueList = [];

  const sortOrderActivitiesList = (list) => {
    const sortDate = {};
    list.forEach((key) => {
      sortDate[key] = orderActivities[key].leadingDate
        ? orderActivities[key].leadingDate
        : orderActivities[key].leadingEndDate;
    });

    return list.sort((a, b) =>
      sortDate[a] ? (sortDate[a] > sortDate[b] ? 1 : -1) : 1
    );
  };

  Object.keys(orderActivities).forEach((key) => {
    if (
      orderActivities[key].activityNumber === activityNumber &&
      util.timeHorizonFilter(
        orderActivities[key].leadingDate
          ? orderActivities[key].leadingDate
          : orderActivities[key].leadingStartDate &&
            orderActivities[key].leadingEndDate
          ? orderActivities[key].leadingEndDate
          : null,
        today,
        timeHorizon
      )
    ) {
      if (activityStatus === "open") {
        if (overdueActivities[activityNumber]?.includes(key)) {
          overdueList.push(key);
          overdueList = sortOrderActivitiesList(overdueList);
        } else if (!orderActivities[key].confirmedDate) {
          pendingList.push(key);
          pendingList = sortOrderActivitiesList(pendingList);
        }
      } else if (activityStatus === "confirmed") {
        if (
          !overdueActivities[activityNumber]?.includes(key) &&
          orderActivities[key].confirmedDate
        ) {
          confirmList.push(key);
          confirmList = sortOrderActivitiesList(confirmList);
        }
      } else {
        if (overdueActivities[activityNumber]?.includes(key)) {
          overdueList.push(key);
          overdueList = sortOrderActivitiesList(overdueList);
        } else if (orderActivities[key].confirmedDate) {
          confirmList.push(key);
          confirmList = sortOrderActivitiesList(confirmList);
        } else {
          pendingList.push(key);
          pendingList = sortOrderActivitiesList(pendingList);
        }
      }
    }
  });

  currentActivityOverdueList = overdueList.concat(pendingList, confirmList);

  return {
    orderActivities: currentActivityOverdueList,
    pendingList: pendingList,
  };
};

export default connect(mapStateToProps)(OrderList);
