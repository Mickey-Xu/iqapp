import { Box } from "@material-ui/core";
import ProjectItemList from "components/ProjectItemList";
import ProjectSearchBar from "components/ProjectSearchBar";
import { LocalizeContext } from "i18n";
import { allActivitiesNosInProjectProgress } from "js/publicFn";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getCurrentElevatorStatus,
  getDocumentComplateStatus,
  getStopsOrHoistHeight,
  scrollToPosition,
} from "../../js/util";

const ProjectProgressPage = ({ data, projectNumber, activityNumberList }) => {
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
        activityNumberList.length > 0 ? activityNumberList[0] : "1000"
      );
    }, []);
  };

  useInitSelectedActivityNumber();

  const scrollRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      scrollToPosition(scrollRef, location.pathname);
    }, 1000);
  }, [location.pathname]);

  return (
    <PrimaryLayout title={`${i18n.ISNTAPP_PROJECT_PROGRESS}: ${projectNumber}`}>
      <Box
        style={{
          width: "90%",
          position: "fixed",
          left: "17px",
          zIndex: "100",
          backgroundColor: "#fafafa",
          height: "48px",
        }}
      >
        <ProjectSearchBar
          placeholder={i18n.ISNTAPP_SEARCH_ORDER}
          onChange={(value) => {
            setSearchValue(value);
          }}
        />
      </Box>
      <Box
        mt={2}
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "16px",
          position: "absolute",
          top: "32px",
          height: window.screen.height - 168 + "px",
          overflow: "hidden auto",
        }}
        ref={scrollRef}
      >
        <ProjectItemList data={data} />
      </Box>
    </PrimaryLayout>
  );
};

export default connect(
  (
    {
      orderActivities,
      orders,
      orderInstallationMethods,
      productFamilies,
      activities,
      auth,
      wayToInstallList,
      templates,
      documentList,
      chars,
    },
    { match }
  ) => {
    const { projectNumber } = match.params;
    const data = [];
    const ordersOfThisProject = Object.keys(orders).filter((order) => {
      return orders[order].projectNumber === projectNumber;
    });

    const activityNumberAndUnitDesignationMapping = {};

    const activityNumberList = allActivitiesNosInProjectProgress(
      auth.activityAuth,
      auth.roles[0]
    );

    activityNumberList.forEach((number) => {
      activityNumberAndUnitDesignationMapping[number] =
        activities[number]?.descriptionShort;
    });

    for (let i = 0; i < ordersOfThisProject.length; i++) {
      const toDoOrDne = getDocumentComplateStatus(
        auth,
        projectNumber,
        ordersOfThisProject[i],
        orderActivities,
        templates,
        documentList
      );

      const elevatorProgress = getCurrentElevatorStatus(
        orderActivities,
        ordersOfThisProject[i]
      );

      const stops = getStopsOrHoistHeight(
        chars,
        ordersOfThisProject[i],
        "stops"
      );

      const hoistHeight = getStopsOrHoistHeight(
        chars,
        ordersOfThisProject[i],
        "hoistHeight"
      );
      const productLine = orders[ordersOfThisProject[i]].productLine;
      const productFamily = orders[ordersOfThisProject[i]].productFamily;
      const installationMethodCode =
        orderInstallationMethods[ordersOfThisProject[i]].installationMethod;
      const installationMethodName =
        wayToInstallList[productLine + "-" + productFamily]
          ?.installationMethods?.[installationMethodCode];

      for (let j = 0; j < activityNumberList.length; j++) {
        const orderActivity =
          orderActivities[ordersOfThisProject[i] + "-" + activityNumberList[j]];
        if (orderActivity) {
          data.push({
            unitDesignation: orders[ordersOfThisProject[i]].unitDesignation,
            productFamily:
              productFamilies[orders[ordersOfThisProject[i]].productFamily]
                .name,
            installationMethod: installationMethodName,
            orderNumber: ordersOfThisProject[i],
            activityNumber: activityNumberList[j],
            documentCompleteStatus: toDoOrDne,
            elevatorProgress: elevatorProgress,
            stops: stops,
            hoistHeight: hoistHeight,
          });
        }
      }
    }
    return {
      data,
      projectNumber,
      activityNumberList,
    };
  }
)(ProjectProgressPage);
