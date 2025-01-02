import OrderActivityList from "components/OrderActivityList";
import OrderActivityListCard from "components/OrderActivityListCard";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";
import { LocalizeContext } from "i18n";
import * as action from "actions";
import * as publicFn from "../../js/publicFn/index";

const OrderActivityListPage = ({ data, orderNumber, submit }) => {
  const i18n = React.useContext(LocalizeContext);

  return (
    <PrimaryLayout title={i18n.ISNTAPP_JOBLIST_ACTIVITY + ": " + orderNumber}>
      <OrderActivityList
        data={data}
        component={OrderActivityListCard}
        tabType="activity"
        submit={(activityNumber, date, type) => {
          submit(activityNumber, orderNumber, date, type);
        }}
      ></OrderActivityList>
    </PrimaryLayout>
  );
};

const mapDispatchToState = (dispatch) => {
  return {
    submit: (activityNumber, orderNumber, date, type) => {
      let data = {
        activityNo: activityNumber,
        date: date ? date : "",
        orderNo: orderNumber,
        type: type,
      };
      dispatch(action.updateOrderActivityStatus(data));
    },
  };
};

export default connect(
  (
    { orders, orderActivities, activities, auth },
    {
      match: {
        params: { number: orderNumber },
      },
    }
  ) => {
    const hideInProgress = auth.activityAuth.hideInProgress;
    const { productFamily } = orders[orderNumber] || {};

    return {
      data: Object.keys(orderActivities)
        .filter((key) => {
          return (
            orderActivities[key].orderNumber === orderNumber &&
            activities[orderActivities[key].activityNumber] &&
            !hideInProgress.includes(orderActivities[key].activityNumber)
          );
        })
        .map((key) => {
          const activityNumber = orderActivities[key].activityNumber;
          const {
            confirmedDate,
            leadingDate,
            leadingStartDate,
            leadingEndDate,
            info,
          } = orderActivities[key];
          const { descriptionShort } = activities[activityNumber];

          let authOrderActivities = {
            auth,
            orderActivities,
          };

          let ownprops = {
            activityNumber,
            orderNumber,
          };

          let isExecutable = publicFn.DatePermissionControl(
            authOrderActivities,
            ownprops
          );

          return {
            activityNumber: activityNumber,
            confirmedDate: confirmedDate
              ? new Date(confirmedDate).toLocaleDateString()
              : "-",
            descriptionShort: descriptionShort,
            leadingDate: leadingDate
              ? new Date(leadingDate).toLocaleDateString()
              : leadingStartDate && leadingEndDate
              ? new Date(leadingEndDate).toLocaleDateString()
              : "-",
            info: info || "-",
            orderNumber: orderNumber,
            productFamily,
            isExecutable,
          };
        }),
      orderNumber: orderNumber,
    };
  },
  mapDispatchToState
)(OrderActivityListPage);
