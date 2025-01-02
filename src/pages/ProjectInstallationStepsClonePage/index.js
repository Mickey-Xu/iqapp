import { Box, withStyles } from "@material-ui/core";
import * as action from "actions";
import ProjectItemList from "components/ProjectItemList";
import ProjectSearchBar from "components/ProjectSearchBar";
import SwitchActivityNumber from "components/SwitchActivityNumberCopy";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useState } from "react";
import { connect } from "react-redux";

const ProjectProgressClonePage = withStyles(({ spacing }) => {
  return {};
})(
  ({
    projectNumber,
    data,
    activityNumberList,
    activityNumberAndunitDesignationMappig,
    stepNumberList,
  }) => {
    // const [filterField, setFilterField] = useState("");
    const [groupCheckList, setGroupCheckList] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState("");
    const i18n = React.useContext(LocalizeContext);

    data = searchCriteria
      ? data.filter((item) => {
          return (
            item.orderNumber.indexOf(searchCriteria) > -1 ||
            item.installationMethod.indexOf(searchCriteria) > -1
          );
        })
      : data;

    return (
      <PrimaryLayout
        title={`${i18n.ISNTAPP_JOBLIST_INST_STEPS}: ${projectNumber}`}
      >
        <Box m={2}>
          <ProjectSearchBar
            placeholder={i18n.ISNTAPP_SEARCH_ORDER}
            submit={(value) => {
              setSearchCriteria(value);
            }}
          />
          <SwitchActivityNumber
            // setfilterField={setFilterField}
            projectNumber={projectNumber}
            setGroupCheckList={setGroupCheckList}
            groupCheckList={groupCheckList}
            flag={true}
            initStep={"7010"}
            stepNumberList={stepNumberList}
            activityNumberList={activityNumberList}
            activityNumberAndunitDesignationMappig={
              activityNumberAndunitDesignationMappig
            }
          />
        </Box>

        <ProjectItemList data={data} />
      </PrimaryLayout>
    );
  }
);

const mapStateToProps = (
  {
    orderActivities,
    orders,
    orderInstallationMethods,
    projectFilterValue,
    productFamilies,
    activities,
    auth,
    installations,
  },
  { match }
) => {
  const { projectNumber } = match.params;
  const CurrentProjectAllOrderNumberList = new Set();
  var activityNumberListSet = new Set();
  const activityNumberAndunitDesignationMappig = {};
  var stepNumberListSet = new Set();

  const installationMapping = {
    1: "Scaffold",
    2: "Scaffoldless",
    3: "Tirak",
    4: "Elevator",
  };
  return {
    data: Object.keys(orders)
      .filter((order) => {
        return orders[order].projectNumber === projectNumber;
      })
      .map((order) => {
        const {
          installationMethod,
          number,
          productFamily,
          unitDesignation,
        } = orders[order];

        Object.keys(installations).forEach((item) => {
          stepNumberListSet.add(installations[item].stepNumber);
        });

        Object.keys(orderActivities)
          .filter((orderActivitie) => {
            return orderActivities[orderActivitie].orderNumber === number;
          })
          .forEach((key) => {
            const { activityNumber } = orderActivities[key];
            activityNumberAndunitDesignationMappig[activityNumber] =
              activities[activityNumber]?.descriptionShort;
            activityNumberListSet.add(activityNumber);
          });

        return Object.keys(orderActivities)
          .filter((orderActivitie) => {
            return projectFilterValue
              ? orderActivities[orderActivitie].orderNumber === number &&
                  orderActivities[orderActivitie].activityNumber ===
                    projectFilterValue
              : orderActivities[orderActivitie].orderNumber === number;
          })
          .map((key) => {
            const {
              confirmedDate,
              leadingStartDate,
              leadingEndDate,
              leadingDate,
              orderNumber,
              activityNumber,
            } = orderActivities[key];
            const confirmedDateFormatter = confirmedDate
              ? new Date(confirmedDate).toLocaleDateString()
              : "-";
            const leadingDateFormatter = leadingDate
              ? new Date(leadingDate).toLocaleDateString()
              : leadingStartDate && leadingEndDate
              ? new Date(leadingEndDate).toLocaleDateString()
              : "-";
            CurrentProjectAllOrderNumberList.add(orderNumber);
            return {
              unitDesignation: unitDesignation,
              productFamily: productFamilies[productFamily].name,
              installationMethod:
                installationMapping[
                  orderInstallationMethods[installationMethod]
                    .installationMethod
                ],
              Doc: "Done",
              ConfirmDate: `${confirmedDateFormatter}`,
              PlanDate: `${leadingDateFormatter}`,
              orderNumber: orderNumber,
              activityNumber: activityNumber,
            };
          })[0];
      }),
    CurrentProjectAllOrderNumberList: Array.from(
      CurrentProjectAllOrderNumberList
    ),
    projectNumber,
    activityNumberList: Array.from(activityNumberListSet),
    activityNumberAndunitDesignationMappig: activityNumberAndunitDesignationMappig,
    stepNumberList: Array.from(stepNumberListSet),
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    cleanSlectedCheckBoxList: () => {
      dispatch(action.cleanSlectedCheckBoxList());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectProgressClonePage);