import { Button, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import { LocalizeContext } from "i18n";
import { getStopsOrHoistHeight } from "js/util";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const OrderListItem = withStyles(({ spacing, palette }) => {
  return {
    root: {
      backgroundColor: "#ffffff",
      padding: spacing(1.25, 0, 1.25, 2.5),
      marginBottom: spacing(1.25),
    },

    date: {
      fontSize: spacing(1.5),
      color: "#878787",
    },
    overdue: {
      width: spacing(11),
      color: "white!important",
      backgroundColor: "red!important",
      borderRadius: spacing(2.5),
      lineHeight: "unset",
      padding: spacing(0.25, 1.75),
    },
    pending: {
      width: spacing(11),
      color: "white!important",
      backgroundColor: "#8bc34a!important",
      borderRadius: spacing(2.5),
      lineHeight: "unset",
      padding: spacing(0.25, 1.75),
    },
    button: {
      width: spacing(11),
      borderRadius: spacing(2.5),
      lineHeight: "unset",
      padding: spacing(0.25, 1.75),
    },
  };
})(
  ({
    classes,
    activityNumber,
    confirmedDate,
    leadingDate,
    orderNumber,
    projectName,
    projectNumber,
    productFamilyName,
    overdueActivities,
    pendingList,
    toOrder,
    unitDesignation,
    stops,
    hoistHeight,
  }) => {
    const history = useHistory();
    const i18n = React.useContext(LocalizeContext);

    const overdueActivity =
      overdueActivities[activityNumber]?.indexOf(
        orderNumber + "-" + activityNumber
      ) > -1;
    const pendingActivity =
      pendingList?.indexOf(orderNumber + "-" + activityNumber) > -1;
    return (
      <div
        className={classes.root}
        onClick={() => toOrder(history, orderNumber)}
      >
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Typography variant="h6">{orderNumber}</Typography>
            <Typography variant="body2" clolor="secondary">
              {productFamilyName}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              disabled
              classes={{
                root: overdueActivity
                  ? classes.overdue
                  : pendingActivity
                  ? classes.pending
                  : classes.button,
              }}
            >
              <Typography variant="caption">{leadingDate}</Typography>
            </Button>
            <Button disabled variant="contained" className={classes.button}>
              <Typography variant="caption">{confirmedDate}</Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item className={classes.content}>
            {i18n.ISNTAPP_DESIGNATION}:
          </Grid>
          <Grid item xs className={classes.content}>
            {unitDesignation}
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item className={classes.content}>
            {i18n.INSTALLATION_STOPS}:
          </Grid>
          <Grid item className={classes.content}>
            {stops}
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item className={classes.content}>
            {i18n.INSTALLATION_HOIST_HEIGHT}:
          </Grid>
          <Grid item xs className={classes.content}>
            {hoistHeight}
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item className={classes.content}>
            {i18n.PROJECTLIST_PROJECT_NO}:
          </Grid>
          <Grid item xs className={classes.content}>
            {projectNumber}
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item className={classes.content}>
            {i18n.INSTALLATION_PROJECT_NAME}:
          </Grid>
          <Grid item xs className={classes.content}>
            {projectName}
          </Grid>
        </Grid>
      </div>
    );
  }
);

const mapStateToProps = (state, ownProps) => {
  const {
    orders,
    orderActivities,
    overdueActivities,
    projects,
    productFamilies,
    chars,
  } = state;
  const { number, pendingList } = ownProps;
  const {
    activityNumber,
    confirmedDate,
    leadingDate,
    orderNumber,
    leadingStartDate,
    leadingEndDate,
  } = orderActivities[number];
  const { productFamily, projectNumber } = orders[orderNumber];
  const { description: projectName } = projects[projectNumber];
  const { name: productFamilyName } = productFamilies[productFamily];

  const stops = getStopsOrHoistHeight(chars, orderNumber, "stops");

  const hoistHeight = getStopsOrHoistHeight(chars, orderNumber, "hoistHeight");
  return {
    activityNumber,
    confirmedDate: confirmedDate
      ? new Date(confirmedDate).toLocaleDateString()
      : "-",
    leadingDate: leadingDate
      ? new Date(leadingDate).toLocaleDateString()
      : leadingStartDate && leadingEndDate
      ? new Date(leadingEndDate).toLocaleDateString()
      : "-",
    orderNumber,
    overdueActivities,
    pendingList,
    productFamily,
    productFamilyName,
    projectName,
    projectNumber,
    unitDesignation: orders[orderNumber].unitDesignation,
    stops,
    hoistHeight,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    toOrder: (history, orderNumber) => {
      history.push(`/order/${orderNumber}`);
      dispatch(action.setOrderDetailPageDefaultTab("basic"));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToState)(OrderListItem);
