import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import ConfirmedDate from "components/ConfirmedDate";
import LeadingDate from "components/LeadingDate";
import { LocalizeContext } from "i18n";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { timeSort, toDoOrDone } from "../../js/util";
const OrderActivityDocument = ({
  activityNo,
  document,
  orderNo,
  productFamily,
}) => {
  const i18n = React.useContext(LocalizeContext);

  const history = useHistory();
  const ToDo = i18n.ISNTAPP_JOBLIST_DOC_TODO + " >";
  const Done = i18n.ISNTAPP_JOBLIST_DOC_DONE + " >";
  const WithoutTemplates = i18n.ISNTAPP_WITHOUT_TEMPLATES + " >";

  return (
    <Box
      onClick={() => {
        history.push(`/documents/${activityNo}/${orderNo}/${productFamily}`);
      }}
    >
      {document === "Done"
        ? Done
        : document === "ToDo"
        ? ToDo
        : WithoutTemplates}
    </Box>
  );
};

const OrderInstallationListItem = withStyles(({ spacing }) => {
  return {
    root: {
      borderBottom: "1px solid darkgray",
      padding: spacing(1, 0.5, 1, 0),
    },
    description: {
      overflow: "initial",
    },

    tooltip: {
      display: "flex",
      justifyContent: "flex-end",
    },
  };
})(
  ({
    classes,
    data: {
      activityNumber,
      description,
      leadingDate,
      confirmedDate,
      info,
      orderNumber,
      stepNumber,
      originalStep,
      productFamily,
    },
    document,
    confirmedTime,
    today = new Date().setHours(0, 0, 0, 0),
  }) => {
    return (
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={4}>
          <Typography variant="body2">{stepNumber}</Typography>
          <Typography variant="body2" noWrap className={classes.description}>
            {description}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <LeadingDate
            confirmedDate={confirmedDate}
            leadingDate={leadingDate}
            orderNumber={orderNumber}
            activityNumber={activityNumber}
            today={today}
          />
        </Grid>
        <Grid item xs={4}>
          <ConfirmedDate
            confirmedDate={confirmedTime}
            orderNumber={orderNumber}
            activityNumber={activityNumber}
            today={today}
            originalStep={originalStep}
            type="orderInstall"
          />
        </Grid>
        <Grid item xs={4}>
          <OrderActivityDocument
            activityNo={stepNumber}
            orderNo={orderNumber}
            productFamily={productFamily}
            document={document}
          />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4} className={classes.tooltip}>
          {info}
        </Grid>
      </Grid>
    );
  }
);

export default connect(
  (
    { templates = [], documentList, orders, orderActivities },
    { data: { stepNumber: activityNo, orderNumber, editable, confirmedDate } }
  ) => {
    const projectNumber = orders[orderNumber]?.projectNumber;
    const documentActivity =
      documentList[projectNumber]?.[orderNumber]?.[activityNo];
    const activityModified = documentActivity
      ? documentActivity.sort(timeSort("modified", false))
      : null;
    const confirmedTime = editable
      ? confirmedDate
      : activityModified
      ? activityModified?.[0].modified
      : null;

    const document = toDoOrDone(
      projectNumber,
      orderNumber,
      activityNo,
      templates,
      documentList
    );

    return {
      document,
      confirmedTime,
    };
  }
)(OrderInstallationListItem);
