import { Box, Card, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import classnames from "classnames";
import { LocalizeContext } from "i18n";
import { showInActivityListSteps } from "js/publicFn";
import * as util from "js/util";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const ActivityList = withStyles(({ spacing }) => {
  return {
    overdue: {
      backgroundColor: "red",
      color: "white",
    },
    normal: {
      backgroundColor: "#9cea40",
      color: "white",
    },
    cardStyle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "33%",
      padding: "20px 0",
    },
    grid: {
      fontSize: "14px",
      marginLeft: 1,
    },
  };
})(({ classes, overdueActivities, data, setOverdueActivities }) => {
  const history = useHistory();
  const i18n = React.useContext(LocalizeContext);

  const useOverdueActivities = (setOverdueActivities) => {
    useEffect(() => {
      setOverdueActivities(overdueActivities);
    }, [setOverdueActivities]);
  };

  useOverdueActivities(setOverdueActivities);

  return (
    <Box>
      {data.map((activity, index) => {
        return activity.total > 0 ? (
          <div key={index}>
            <Card
              elevation={0}
              onClick={() => {
                history.push(`/activity/${activity.number}`);
              }}
              style={{ margin: "8px 0", borderRadius: "0" }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 80,
                }}
              >
                <Box
                  style={{ width: "1%" }}
                  className={classnames({
                    [`${classes.overdue}`]: activity.overdue > 0,
                    [`${classes.normal}`]: activity.overdue <= 0,
                  })}
                >
                  <div
                    style={{
                      width: `2px`,
                      height: `80px`,
                    }}
                  ></div>
                </Box>
                <Grid container spacing={3} className={classes.grid}>
                  <Grid item xs={5}>
                    <Typography style={{ fontWeight: "bold" }}>
                      {activity.number}
                    </Typography>
                    <Box>
                      {activity.descriptionShort3
                        ? activity.descriptionShort3 + "-扶梯"
                        : activity.descriptionShort}
                    </Box>
                    <Box>
                      {activity.descriptionShort14
                        ? activity.descriptionShort14 + "-电梯"
                        : ""}
                    </Box>
                  </Grid>
                  <Grid item style={{ textAlign: "center" }} xs={2}>
                    <Typography color="secondary">{activity.total}</Typography>
                    <Box>{i18n.INSTAPP_JOBLIST_ACTIVITY_SUM}</Box>
                  </Grid>
                  <Grid
                    item
                    style={{ textAlign: "center", padding: "12px 9px" }}
                    xs={2}
                  >
                    <Typography color="secondary">
                      {activity.notOverdue}
                    </Typography>
                    <Box>{i18n.INSTALLATION_FUTURE}</Box>
                  </Grid>
                  <Grid item style={{ textAlign: "center" }} xs={2}>
                    <Typography color="secondary">
                      {activity.overdue}
                    </Typography>
                    <Box>{i18n.INSTAPP_JOBLIST_ACTIVITY_OVERDUE}</Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </div>
        ) : null;
      })}
    </Box>
  );
});

const mapStateToProps = ({
  activities,
  orderActivities,
  timeHorizon,
  auth,
}) => {
  const today = new Date().setHours(0, 0, 0, 0);
  // const hideInProgress = auth.activityAuth.hideInProgress;
  let overdueActivities = {};

  const total = (activityNumber) => {
    return Object.keys(orderActivities).filter((key) => {
      return (
        orderActivities[key].activityNumber === activityNumber &&
        !orderActivities[key].confirmedDate &&
        util.timeHorizonFilter(
          orderActivities[key].leadingDate
            ? orderActivities[key].leadingDate
            : orderActivities[key].leadingEndDate,
          today,
          timeHorizon
        )
      );
    }).length;
  };

  // const overdue = (activityNumber) => {
  //   const calculateOverdue = (orderActivityNumber) => {
  //     if (orderActivities[orderActivityNumber]) {
  //       return (
  //         new Date(orderActivities[orderActivityNumber].leadingDate).getTime() <
  //           today && !orderActivities[orderActivityNumber].confirmedDate
  //       );
  //     } else {
  //       return false;
  //     }
  //   };

  //   const overdueList = Object.keys(orderActivities).filter((key) => {
  //     let passedActivity = false;

  //     if (orderActivities[key].activityNumber !== activitiesList[0].number) {
  //       if (orderActivities[key].activityNumber === activityNumber) {
  //         let currentActivityIndex = 0;
  //         const orderNumber = orderActivities[key].orderNumber;

  //         activitiesList.forEach((item, activityIndex) => {
  //           if (item.number === activityNumber) {
  //             currentActivityIndex = activityIndex;
  //           }
  //         });

  //         activitiesList.forEach((item, index) => {
  //           if (index < currentActivityIndex) {
  //             if (calculateOverdue(orderNumber + "-" + item.number)) {
  //               passedActivity = calculateOverdue(
  //                 orderNumber + "-" + item.number
  //               );
  //             }
  //           }
  //         });
  //       }
  //     } else {
  //       passedActivity = false;
  //     }

  //     return (
  //       orderActivities[key].activityNumber === activityNumber &&
  //       util.timeHorizonFilter(
  //         orderActivities[key].leadingDate,
  //         today,
  //         timeHorizon
  //       ) &&
  //       calculateOverdue(key) &&
  //       !passedActivity
  //     );
  //   });

  //   if (overdueList.length > 0) {
  //     overdueActivities[activityNumber] = overdueList;
  //   }

  //   return overdueList.length;
  // };

  const overdue = (activityNumber) => {
    const calculateOverdue = (orderActivityNumber) => {
      const orderActivity = orderActivities[orderActivityNumber];
      if (orderActivity) {
        if (!orderActivity.leadingDate) {
          if (orderActivity.leadingStartDate && orderActivity.leadingEndDate) {
            return (
              new Date(orderActivity.leadingEndDate).getTime() < today &&
              !orderActivity.confirmedDate
            );
          }
        } else {
          return (
            new Date(orderActivity.leadingDate).getTime() < today &&
            !orderActivity.confirmedDate
          );
        }
      } else {
        return false;
      }
    };

    const overdueList = Object.keys(orderActivities).filter((key) => {
      return (
        orderActivities[key].activityNumber === activityNumber &&
        util.timeHorizonFilter(
          orderActivities[key].leadingDate
            ? orderActivities[key].leadingDate
            : orderActivities[key].leadingEndDate,
          today,
          timeHorizon
        ) &&
        calculateOverdue(key)
      );
    });

    if (overdueList.length > 0) {
      overdueActivities[activityNumber] = overdueList;
    }

    return overdueList.length;
  };

  // const notOverdue = (total, overdue, activityNumber) => {
  //   const confirmedCount = Object.keys(orderActivities).filter((key) => {
  //     return (
  //       orderActivities[key].activityNumber === activityNumber &&
  //       util.timeHorizonFilter(
  //         orderActivities[key].leadingDate,
  //         today,
  //         timeHorizon
  //       ) &&
  //       orderActivities[key].confirmedDate
  //     );
  //   }).length;

  //   return total - overdue - confirmedCount;
  // };

  var orderActivitiesList = [];
  Object.keys(orderActivities).forEach((item) => {
    orderActivitiesList.push(orderActivities[item]);
  });

  var activitiesObj = activities;
  orderActivitiesList.forEach((item) => {
    if (activitiesObj[item.activityNumber]) {
      activitiesObj[item.activityNumber].sort = item.sort;
    }
  });

  var activitiesList = [];
  Object.keys(activitiesObj).forEach((item) => {
    activitiesList.push(activitiesObj[item]);
  });

  let showStepNos = [];

  // let rolesMapper = { sc: "Subcon TL", pe: "PE" };

  // Object.keys(auth.activityAuth).forEach((name) => {
  //   if (auth.roles.indexOf(rolesMapper[name.substring(0, 2)]) > -1) {
  //     showStepNos = showStepNos.concat(auth.activityAuth[name]);
  //   }
  // });

  showStepNos = showInActivityListSteps(auth.activityAuth, auth.roles[0]);

  activitiesList = activitiesList
    .filter((item) => {
      return (
        // !hideInProgress.includes(item.number) ||
        showStepNos.includes(item.number)
      );
    })
    .sort((a, b) => (a.sort ? (a.sort > b.sort ? 1 : -1) : 1));

  return {
    data: activitiesList.map((item) => {
      return {
        ...activities[item.number],
        total: total(item.number),
        overdue: overdue(item.number),
        notOverdue: total(item.number) - overdue(item.number),
        // notOverdue: notOverdue(
        //   total(item.number),
        //   overdue(item.number),
        //   item.number
        // ),
      };
    }),
    overdueActivities: overdueActivities,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOverdueActivities: (data) => {
      dispatch(action.setOverdueActivities(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);
