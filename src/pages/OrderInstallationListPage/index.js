import * as action from "actions";
import OrderActivityList from "components/OrderActivityList";
import OrderActivityListCard from "components/OrderActivityListCard";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";
import * as publicFn from "../../js/publicFn/index";

const OrderInstallationListPage = ({ data, orderNumber, submit }) => {
  const i18n = React.useContext(LocalizeContext);

  return (
    <PrimaryLayout title={i18n.ISNTAPP_JOBLIST_INST_STEPS + ": " + orderNumber}>
      <OrderActivityList
        data={data}
        component={OrderActivityListCard}
        tabType=""
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
    { auth, installations, orderActivities, orders },
    {
      match: {
        params: { number: orderNumber },
      },
    }
  ) => {
    const { productFamily } = orders[orderNumber] || {};

    return {
      data: Object.keys(installations)
        .filter((key) => {
          return installations[key].orderNumber === orderNumber;
        })
        .map((key) => {
          const stepNumber = installations[key].stepNumber;
          const description = installations[key].description;
          const {
            confirmedDate,
            leadingDate,
            leadingEndDate,
            leadingStartDate,
            info,
            originalStep,
            activityNumber,
            editable,
          } = orderActivities[key] || {};

          let authOrderActivities = {
            auth,
            orderActivities,
          };

          let ownprops = {
            activityNumber,
            orderNumber,
          };

          const isExecutable = publicFn.DatePermissionControl(
            authOrderActivities,
            ownprops
          );
          return {
            activityNumber: activityNumber,
            confirmedDate: confirmedDate
              ? new Date(confirmedDate).toLocaleDateString()
              : "-",
            descriptionShort: description,
            leadingDate: leadingDate
              ? new Date(leadingDate).toLocaleDateString()
              : leadingStartDate && leadingEndDate
              ? new Date(leadingEndDate).toLocaleDateString()
              : "-",
            info: info || "-",
            orderNumber: orderNumber,
            stepNumber: stepNumber,
            productFamily,
            originalStep,
            editable,
            isExecutable,
          };
        }),
      orderNumber: orderNumber,
    };
  },
  mapDispatchToState
)(OrderInstallationListPage);
