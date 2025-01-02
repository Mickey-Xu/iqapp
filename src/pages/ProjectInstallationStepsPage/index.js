import { Box } from "@material-ui/core";
import ProjectItemList from "components/ProjectItemList";
import ProjectSearchBar from "components/ProjectSearchBar";
import SwitchActivityNumber from "components/SwitchActivityNumber";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const ProjectInstallationStepsPage = ({
  data,
  projectNumber,
  activityNumberList,
  activityNumberAndUnitDesignationMapping,
}) => {
  const i18n = React.useContext(LocalizeContext);

  const [searchValue, setSearchValue] = useState("");
  const [selectedActivityNumber, setSelectedActivityNumber] = useState("");

  data = data.filter((item) => {
    return item.activityNumber === selectedActivityNumber;
  });

  data = searchValue
    ? data.filter((item) => {
        return (
          item.orderNumber?.indexOf(searchValue) > -1 ||
          item.installationMethod?.indexOf(searchValue) > -1
        );
      })
    : data;

  const useInitSelectedActivityNumber = () => {
    useEffect(() => {
      setSelectedActivityNumber(
        activityNumberList.length > 0 ? activityNumberList[0] : "7010"
      );
    }, []);
  };

  useInitSelectedActivityNumber();

  return (
    <PrimaryLayout title={`${i18n.ISNTAPP_PROJECT_PROGRESS}: ${projectNumber}`}>
      <Box style={{ padding: "14px" }}>
        <ProjectSearchBar
          placeholder={i18n.ISNTAPP_SEARCH_ORDER}
          onChange={(value) => {
            setSearchValue(value);
          }}
        />
        <Box style={{ margin: "10px 0" }}>
          <SwitchActivityNumber
            projectNumber={projectNumber}
            isInstallationStep={true}
            initValue={
              activityNumberList.length > 0 ? activityNumberList[0] : "7010"
            }
            activityNumberList={activityNumberList}
            activityNumberAndUnitDesignationMapping={
              activityNumberAndUnitDesignationMapping
            }
            onChange={(value) => {
              setSelectedActivityNumber(value);
            }}
          />
        </Box>
        <ProjectItemList data={data} />
      </Box>
    </PrimaryLayout>
  );
};

const mapStateToProps = (
  {
    orderActivities,
    orders,
    orderInstallationMethods,
    productFamilies,
    activities,
    wayToInstallList,
  },
  { match }
) => {
  const { projectNumber } = match.params;
  const activityNumberAndUnitDesignationMapping = {};

  const data = [];

  const activityNumberList = [
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

  activityNumberList.forEach((number) => {
    activityNumberAndUnitDesignationMapping[number] =
      activities[number]?.descriptionShort;
  });

  const ordersOfThisProject = Object.keys(orders).filter((order) => {
    return orders[order].projectNumber === projectNumber;
  });

  for (let i = 0; i < ordersOfThisProject.length; i++) {
    const installationMethodCode =
      orderInstallationMethods[ordersOfThisProject[i]].installationMethod;
    const productLine = orders[ordersOfThisProject[i]].productLine;
    const installationMethodName =
      wayToInstallList[productLine]?.installationMethods?.[
        installationMethodCode
      ];

    for (let j = 0; j < activityNumberList.length; j++) {
      const orderActivity =
        orderActivities[ordersOfThisProject[i] + "-" + activityNumberList[j]];

      if (orderActivity) {
        const confirmedDateFormatter = orderActivity.confirmedDate
          ? new Date(orderActivity.confirmedDate).toLocaleDateString()
          : "-";
        const leadingDateFormatter = orderActivity.leadingDate
          ? new Date(orderActivity.leadingDate).toLocaleDateString()
          : orderActivity.leadingStartDate && orderActivity.leadingEndDate
          ? new Date(orderActivity.leadingEndDate).toLocaleDateString()
          : "-";

        data.push({
          unitDesignation: orders[ordersOfThisProject[i]].unitDesignation,
          productFamily:
            productFamilies[orders[ordersOfThisProject[i]].productFamily].name,
          installationMethod: installationMethodName,
          ConfirmDate: confirmedDateFormatter,
          PlanDate: leadingDateFormatter,
          orderNumber: ordersOfThisProject[i],
          activityNumber: activityNumberList[j],
        });
      }
    }
  }

  return {
    data,
    projectNumber,
    activityNumberList,
    activityNumberAndUnitDesignationMapping,
  };
};

export default connect(mapStateToProps)(ProjectInstallationStepsPage);
