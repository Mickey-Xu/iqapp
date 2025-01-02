import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import ConfirmedDate from "components/ConfirmedDate";
import LeadingDate from "components/LeadingDate";
import { LocalizeContext } from "i18n";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { toDoOrDone } from "../../js/util";

const OrderActivityDocument = ({
  activityNo,
  document,
  orderNumber,
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
        history.push(
          `/documents/${activityNo}/${orderNumber}/${productFamily}`
        );
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

const OrderActivitListItem = withStyles(({ spacing }) => {
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
      descriptionShort,
      activityNumber,
      confirmedDate,
      orderNumber,
      leadingDate,
      info,
      productFamily,
    },
    document,
    today = new Date().setHours(0, 0, 0, 0),
  }) => {
    return (
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={4}>
          <Typography variant="body2">{activityNumber}</Typography>
          <Typography variant="body2" noWrap className={classes.description}>
            {descriptionShort}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <LeadingDate
            confirmedDate={confirmedDate}
            leadingDate={leadingDate}
            today={today}
            activityNumber={activityNumber}
            orderNumber={orderNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <ConfirmedDate
            activityNumber={activityNumber}
            confirmedDate={confirmedDate}
            orderNumber={orderNumber}
            today={today}
          />
        </Grid>
        <Grid item xs={4}>
          <OrderActivityDocument
            activityNo={activityNumber}
            orderNumber={orderNumber}
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
    { templates = [], documentList, orders },
    { data: { activityNumber: activityNo, orderNumber } }
  ) => {
    const projectNumber = orders[orderNumber]?.projectNumber;
    const document = toDoOrDone(
      projectNumber,
      orderNumber,
      activityNo,
      templates,
      documentList
    );
    return {
      document,
    };
  }
)(OrderActivitListItem);
