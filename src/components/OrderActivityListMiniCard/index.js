import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
import {
  //   CancelOutlined,
  //   CheckCircleOutlineOutlined,
  //   DescriptionOutlined,
  EventAvailableOutlined,
  EventNoteOutlined,
  //   LockOpenOutlined,
  //   LockOutlined,
  ScheduleOutlined,
} from "@material-ui/icons";
import { LocalizeContext } from "i18n";
// import { toDoOrDone } from "../../js/util";
import { isInstallationStep } from "js/installationStep";
import React from "react";
// import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const OrderActivityListMiniCard = withStyles(({ spacing }) => {
  return {
    button: {
      borderRadius: spacing(2.5),
      lineHeight: "unset",
      fontSize: "0.5rem",
      padding: "2px 14px",
    },
    card: {
      marginTop: spacing(2),
      // borderTopStyle: "solid",
      // borderTopColor: "#ff0000",
    },
    cardActions: {
      marginLeft: "0px",
    },
    label: {
      whiteSpace: "nowrap",
    },
    content: {
      padding: spacing(1, 2, 2, 2),
    },
  };
})(({ classes, data, document, handleClickOpen, tabType }) => {
  const i18n = React.useContext(LocalizeContext);
  const history = useHistory();
  const root = "minCard";
  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Box style={{ textAlign: "right" }}>
          <Button
            disabled={!data.isExecutable.canReadDoc}
            color="primary"
            onClick={() => {
              history.push(
                `/documents/${data.activityNumber}/${data.orderNumber}/${data.productFamily}/${root}`
              );
            }}
          >
            查看文档 >
          </Button>
        </Box>
        <Box>
          <Box style={{ display: "inline-flex" }}>
            <ScheduleOutlined color="action" style={{ fontSize: "1.4rem" }} />
            <Typography variant="body1" fontWeight={500}>
              {!isInstallationStep(data.activityNumber)
                ? i18n.JOBLIST_ACTIVITY
                : i18n.ISNTAPP_JOBLIST_INST_STEPS}
              : {data.activityNumber + " " + data.description}
            </Typography>
          </Box>
        </Box>
        <Box mt={1.5}>
          <Grid container>
            <Grid item xs={6} style={{ display: "inline-flex" }}>
              <EventNoteOutlined
                style={{ fontSize: "1.05rem" }}
                color="action"
              />
              <Typography variant="caption">
                {i18n.PROJECTLIST_PLANNED_FINISH}: {data.leadingDate}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: "inline-flex",
                justifyContent: "flex-start",
              }}
            >
              <EventAvailableOutlined
                style={{ fontSize: "1.05rem" }}
                color="action"
              />
              <Typography variant="caption">
                {i18n.PROJECTLIST_CONFIRMED_FINISH}: {data.confirmedDate}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
});

export default OrderActivityListMiniCard;
