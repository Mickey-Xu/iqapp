import { Box, Button } from "@material-ui/core";
import * as action from "actions";
import FFTab from "components/FFTab";
import OrderActivityList from "components/OrderActivityList";
import OrderActivityListCard from "components/OrderActivityListCard";
import OrderActivityListMiniCard from "components/OrderActivityListMiniCard";
import OrderInfo from "components/OrderInfo";
import ProjectSiteAddress from "components/ProjectSiteAddress";
import { LocalizeContext } from "i18n";
import gpsIcon from "img/gps.png";
import installationIcon from "img/installation.png";
import nameIcon from "img/name.png";
import numberIcon from "img/number.png";
import orderIcon from "img/order.png";
import productlineIcon from "img/productline.png";
import progressIcon from "img/progress.png";
import subcontlIcon from "img/subcontl.png";
import teamLeader from "img/teamLeader.png";
import unitIcon from "img/unit.png";
import * as util from "js/util";
import { scrollToPosition } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import * as publicFn from "../../js/publicFn/index";
import { useHistory } from "react-router-dom";
import listIcon from "img/checkList.svg";
import { getChecklistActivityNo } from "js/util";


const OrderDetailPage = ({
  orderNumber,
  data,
  projectNumber,
  showInstallations,
  submit,
  orderActivities,
  orders,
  whetherToShutDown,
  defaultTab,
  documentList,
}) => {
  const i18n = React.useContext(LocalizeContext);
  const history = useHistory();

  const fields = [
    {
      icon: () => <img src={numberIcon} width="20" alt="" />,
      label: i18n.PROJECTLIST_PROJECT_NO,
      name: "projectNumber",
      title: i18n.PROJECTLIST_PROJECT,
    },
    {
      icon: () => <img src={nameIcon} width="20" alt="" />,
      label: i18n.PROJECTLIST_PROJECT_DESCRIPTION,
      name: "projectName",
    },
    {
      icon: () => <img src={gpsIcon} width="20" alt="" />,
      label: i18n.PROJECTLIST_SITE_ADDRESS,
      name: "projectSite",
      component: () => (
        <ProjectSiteAddress projectNumber={data.projectNumber} />
      ),
    },
    {
      icon: () => <img src={teamLeader} width="20" alt="" />,
      label: i18n.INSTAPP_PROJECTLIST_PROJECT_LEADER,
      name: "PM",
    },
    {
      icon: () => <img src={subcontlIcon} width="20" alt="" />,
      label: i18n.JOBLIST_SUBCON_TL,
      name: "teamLeader",
    },
    {
      icon: () => <img src={progressIcon} width="20" alt="" />,
      label: i18n.ISNTAPP_DESIGNATION,
      name: "unitDesignation",
    },
    {
      icon: () => <img src={unitIcon} width="20" alt="" />,
      label: i18n.INSTAPP_PROJECTLIST_UnitCount,
      name: "orderQuantity",
    },
    {
      icon: () => <img src={orderIcon} width="20" alt="" />,
      label: i18n.JOBLIST_ORDER_NUMBER,
      name: "orderNumber",
      title: i18n.JOBLIST_ORDER,
    },
    {
      icon: () => <img src={productlineIcon} width="20" alt="" />,
      label: i18n.ORDERDETAILS_PRODUCT_FAMILY,
      name: "productFamilyName",
    },
    {
      icon: () => <img src={installationIcon} width="20" alt="" />,
      label: i18n.INSTAPP_JOBLIST_INSTMETHOD,
      name: "installMethod",
    },
    {
      icon: () => <img src={progressIcon} width="20" alt="" />,
      label: i18n.INSTAPP_JOBLIST_UNIT_PROGRESS,
      name: "elevatorProgress",
    },
    {
      icon: () => <img src={listIcon} alt="" />,
      label: i18n.VIEW_INSTALLATION_CHECKLIST,
      name: "installationChecklist",
      component: () => (
        <Button
          color="primary"
          style={{ padding: 0, minWidth: " fit-content" }}
          onClick={() => {
            history.push(
              `/documents/${getChecklistActivityNo(data)}/${data.orderNumber}/${data.productFamily
              }/${`installationChecklist`}`
            );
          }}
        >
          >>
        </Button>
      ),
    },
  ];

  const [tab, setTab] = React.useState(defaultTab ? defaultTab : "basic");

  const tabs = [
    { title: i18n.ISNTAPP_BASIC, value: "basic" },
    { title: i18n.ISNTAPP_PENDING, value: "pending" },
    { title: i18n.ISNTAPP_ALL, value: "all" },
  ];

  const title = {
    backgroundColor: "red",
    padding: "4px 0",
    textAlign: "center",
    fontSize: "16px",
    color: "white",
  };

  const scrollRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      scrollToPosition(scrollRef, location.pathname);
    }, 1000);
  }, [location.pathname]);

  !getChecklistActivityNo(data) && fields.splice(fields.length - 1, 1);

  return (
    <PrimaryLayout
      title={i18n.INSTAPP_JOBLIST_UNIT_DETAIL + ": " + data["orderNumber"]}
    >
      <Box
        style={{
          position: "fixed",
          top: "52px",
          width: "100%",
          zIndex: "10000",
        }}
      >
        {whetherToShutDown && (
          <div style={title}>
            <span>{whetherToShutDown}</span>
          </div>
        )}
        <FFTab
          tabs={tabs}
          selectedTabValue={tab}
          onTabChange={(value) => {
            setTab(value);
          }}
        />
      </Box>
      <div
        style={{
          width: "100%",
          padding: "16px",
          position: "absolute",
          top: whetherToShutDown ? "60px" : "32px",
          height: window.screen.height - 187 + "px",
          overflow: "hidden auto",
        }}
        ref={scrollRef}
      >
        {tab === "basic" && <OrderInfo fields={fields} data={data} />}
        {tab === "pending" && (
          <OrderActivityList
            data={data.filteredOrderActivities}
            oneThousandPlannedDate={moment(
              orderActivities[`${orderNumber}-1000`].leadingDate,
              "YYYY/MM/DD"
            ).format("YYYY-MM-DD")}
            nineThousandPlannedDate={moment(
              orderActivities[`${orderNumber}-9000`].leadingDate,
              "YYYY/MM/DD"
            ).format("YYYY-MM-DD")}
            component={OrderActivityListCard}
            tabType="activity"
            submit={(activityNumber, date, type) => {
              submit(
                activityNumber,
                orderNumber,
                projectNumber,
                date,
                type,
                orderActivities,
                orders
              );
            }}
          ></OrderActivityList>
        )}
        {tab === "all" && (
          <OrderActivityList
            data={data.allOrderActivities}
            component={OrderActivityListMiniCard}
          ></OrderActivityList>
        )}
      </div>
    </PrimaryLayout>
  );
};

const mapStateToProps = (state, ownProps) => {
  const {
    orders,
    projects,
    orderInstallationMethods,
    productFamilies,
    partners,
    orderActivities,
    activities,
    // installations,
    auth,
    documentList,
    templates,
    wayToInstallList,
    settings: { defaultTab },
  } = state;
  const { match } = ownProps;
  const { params } = match;
  const { number: orderNumber } = params;
  const projectNumber = orders[orderNumber]?.projectNumber;
  const { description: projectName } = projects[projectNumber]
    ? projects[projectNumber]
    : "";
  const { productFamily } = orders[orderNumber] || {};
  const { name: productFamilyName } = productFamilies[productFamily]
    ? productFamilies[productFamily]
    : "";
  const teamLeader = partners[`${orderNumber}-VW`]?.name1;
  const PM = partners[`${orderNumber}-YI`]?.name1;
  const getHint = (isExecutable) => {
    const finishedDateEditable = isExecutable.finishedDateEditablePermission;
    const finishedDateCancelable =
      isExecutable.finishedDateCancelablePermission;

    if (!finishedDateEditable && !finishedDateCancelable) {
      return "(无确认权限)";
    } else {
      return "";
    }
  };

  const filteredOrderActivitiesData = [];

  publicFn
    .orderDetailSteps(
      orderActivities,
      orderNumber,
      auth.activityAuth,
      auth.roles[0]
    )
    .forEach((activityNo) => {
      if (orderActivities[orderNumber + "-" + activityNo]) {
        let {
          confirmedDate,
          leadingDate,
          leadingEndDate,
          leadingStartDate,
          info,
          originalStep,
          activityNumber,
          editable,
          confPreStart,
          confPast,
          sort,
        } = orderActivities[orderNumber + "-" + activityNo];

        const { descriptionShort, descriptionShort14 } =
          activities[activityNo] || {};

        const description = orderActivities[orderNumber + "-7030"]
          ? descriptionShort14
            ? descriptionShort14
            : descriptionShort
          : descriptionShort;

        let authOrderActivities = {
          auth,
          orderActivities,
          documentList,
          templates,
        };

        let ownprops = {
          activityNumber,
          orderNumber,
          projectNumber,
        };

        const isExecutable = publicFn.DatePermissionControl(
          authOrderActivities,
          ownprops
        );

        if (
          orderActivities[orderNumber + "-" + activityNo].editable !==
          undefined &&
          orderActivities[orderNumber + "-" + activityNo].editable === false
        ) {
          confirmedDate ? (info = "节点已确认") : (info = "节点可确认");
        }

        filteredOrderActivitiesData.push({
          activityNumber: activityNo,
          confirmedDate: confirmedDate
            ? new Date(confirmedDate).toLocaleDateString()
            : "-",
          description: description,
          leadingDate: leadingDate
            ? new Date(leadingDate).toLocaleDateString()
            : leadingStartDate && leadingEndDate
              ? new Date(leadingEndDate).toLocaleDateString()
              : "-",
          info: info || "-",
          orderNumber: orderNumber,
          productFamily,
          originalStep,
          editable,
          isExecutable,
          hint: getHint(isExecutable),
          confPreStart,
          confPast,
          sort,
        });
      }
    });

  const allOrderActivitiesData = [];

  publicFn
    .allOrderDetailSteps(
      orderActivities,
      orderNumber,
      auth.activityAuth,
      auth.roles[0]
    )
    .forEach((activityNo) => {
      if (orderActivities[orderNumber + "-" + activityNo]) {
        let {
          confirmedDate,
          leadingDate,
          leadingEndDate,
          leadingStartDate,
          activityNumber,
          info,
          sort,
        } = orderActivities[orderNumber + "-" + activityNo] || {};

        const { descriptionShort, descriptionShort14 } =
          activities[activityNo] || {};

        const description = orderActivities[orderNumber + "-7030"]
          ? descriptionShort14
            ? descriptionShort14
            : descriptionShort
          : descriptionShort;

        let authOrderActivities = {
          auth,
          orderActivities,
          documentList,
          templates,
        };

        let ownprops = {
          activityNumber,
          orderNumber,
          projectNumber,
        };

        const isExecutable = publicFn.DatePermissionControl(
          authOrderActivities,
          ownprops
        );

        if (
          orderActivities[orderNumber + "-" + activityNo].editable !==
          undefined &&
          orderActivities[orderNumber + "-" + activityNo].editable === false
        ) {
          confirmedDate ? (info = "节点已确认") : (info = "节点可确认");
        }

        allOrderActivitiesData.push({
          activityNumber: activityNo,
          confirmedDate: confirmedDate
            ? new Date(confirmedDate).toLocaleDateString()
            : "-",
          description: description,
          leadingDate: leadingDate
            ? new Date(leadingDate).toLocaleDateString()
            : leadingStartDate && leadingEndDate
              ? new Date(leadingEndDate).toLocaleDateString()
              : "-",
          info: info || "-",
          orderNumber: orderNumber,
          productFamily,
          isExecutable,
          sort,
        });
      }
    });

  const progress = util.orderProgress(orderActivities, orderNumber);
  const whetherToShutDown = util.whetherToShutDown(
    orderActivities,
    orderNumber
  );

  const methods =
    wayToInstallList[
    orders?.[orderNumber]?.productLine +
    "-" +
    orders?.[orderNumber]?.productFamily
    ];

  const methodsList =
    methods &&
    Object.keys(methods.installationMethods).map((item) => {
      return { label: methods.installationMethods[item], value: item };
    });

  const defaultselectValue =
    orderInstallationMethods?.[orderNumber]?.installationMethod;
  const defaultSelectInstalltion = methodsList?.filter((item) => {
    return item.value === defaultselectValue.toString();
  })[0]?.label;

  const unitDesignation = orders[orderNumber]?.unitDesignation;

  return {
    showInstallations: true,
    orderNumber,
    data: {
      projectNumber,
      fitterQuantity: 5,
      orderQuantity: Object.keys(orders).filter((key) => {
        return orders[key].projectNumber === projectNumber;
      }).length,
      projectName,
      teamLeader,
      PM,
      orderNumber,
      productFamily,
      productFamilyName,
      installMethod: defaultSelectInstalltion,
      installMethods: methodsList,
      defaultselectValue,
      elevatorProgress: progress + "%",
      filteredOrderActivities: filteredOrderActivitiesData,
      allOrderActivities: allOrderActivitiesData,
      unitDesignation,
    },
    projectNumber,
    orderActivities,
    confPreStart: orderActivities,
    confPast: orderActivities,
    orders,
    whetherToShutDown,
    defaultTab,
    documentList,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    submit: (
      activityNumber,
      orderNumber,
      projectNumber,
      date,
      type,
      orderActivities,
      orders
    ) => {
      if (
        util.isInstallationStepEditable(
          orderNumber,
          activityNumber,
          orderActivities
        )
      ) {
        const data = util.setActivityStatusParams(
          projectNumber,
          orderNumber,
          activityNumber,
          date,
          type,
          orderActivities,
          orders
        );
        dispatch(action.updateOrderActivityStatus(data));
      } else {
        const data = {
          projectNo: projectNumber,
          orderNo: orderNumber,
          stepNo: activityNumber,
          confirmedDate: date,
        };
        dispatch(action.updateLocalInstallationStepConfirmDate(data));
      };

    },
  };
};

export default connect(mapStateToProps, mapDispatchToState)(OrderDetailPage);
