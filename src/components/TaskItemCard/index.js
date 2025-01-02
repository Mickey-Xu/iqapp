import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
import {
  CheckCircleOutlineOutlined,
  DescriptionOutlined
} from "@material-ui/icons";
import HourglassEmptySharpIcon from '@material-ui/icons/HourglassEmptySharp';
import { useHistory } from "react-router-dom";
import { LocalizeContext } from "i18n";
import React from "react";
import store from "js/store";
import * as action from "actions";

const TaskListCard = withStyles(({ spacing }) => {
  return {
    button: {
      borderRadius: spacing(2.5),
      lineHeight: "unset",
      fontSize: "0.5rem",
      padding: "2px 14px",
    },
    card: {
      marginTop: spacing(2),
    },
    cardActions: {
      marginLeft: "0px",
    },
    contentColor: {
      color: "#999999",
      wordBreak: "break-word",
    },
    fontColor: {
      color: "#e54141",
      // color: "rgba(0, 0, 0, 0.54)",
    },
    iconColor: {
      color: "rgba(0, 0, 0, 0.54)",
    },
  };
})(
  ({
    classes,
    data,
    submit,
    status
  }) => {
    const i18n = React.useContext(LocalizeContext);
    const history = useHistory();

    const document = data.documentStatus === "Done"
      ? i18n.ISNTAPP_UPLOADED
      : data.documentStatus === "ToDo"
        ? i18n.ISNTAPP_JOBLIST_DOC_TODO
        : i18n.ISNTAPP_WITHOUT_TEMPLATES;

    return (
      <Card className={classes.card}>
        <CardContent onClick={() =>
          {
            store.dispatch(action.setTaskDefaultTab(status));
            history.push(`/order/${data.orderNo}`)}
          }
        >
          <Grid container>
            <Grid item xs={12}>
              <Box mt={1} style={{ display: "inline-flex" }}>
                <Typography variant="body2" style={{ marginRight: "4px" }}>
                  {i18n.JOBLIST_ORDER}:
                </Typography>
                <Typography
                  variant="caption"
                >
                  {data.orderNo}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box style={{ display: "inline-flex",marginTop:2 }}>
                <Typography variant="body2" style={{ marginRight: "4px" }}>
                  {i18n.PROJECTLIST_PROJECT}:
                </Typography>
                <Typography
                  variant="caption"
                >
                  {data.projectName}
                </Typography>
              </Box>
            </Grid>
            <Grid item style={{ display: "flex", justifyContent: 'space-between'}} xs={12}>
              <Grid item xs={6}>
                <Typography variant="caption">
                  {i18n.ISNTAPP_PLAN_START_DATE}:
                  {data.planStartDate}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">
                  {i18n.ISNTAPP_ACTUAL_START_DATE}:
                  {data.actualStartDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid item style={{ display: "flex", justifyContent: 'space-between'}} xs={12}>
              <Grid item xs={6}>
                <Typography variant="caption">
                  {i18n.ISNTAPP_PLAN_END_DATE}:
                  {data.planEndDate}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">
                  {i18n.ISNTAPP_ACTUAL_END_DATE}:
                  {data.actualEndDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid item style={{ display: "flex", justifyContent: 'space-between'}} xs={12}>
              <Grid item xs={6}>
              </Grid>
              {data.status === 'closed' &&
                <Grid item xs={6}>
                  <Typography variant="caption">
                    {i18n.ISNTAPP_ACTUAL_CLOSED_DATE}:{data.actualCloseDate}
                  </Typography>
                </Grid>
              }
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          style={{
            backgroundColor: "#f5f5f5",
            padding: "2px",
            justifyContent: "space-around"
          }}
        >
          <Button
            size="small"
            disabled={!data.actualStartDate?false:true}
            style={{
              display:
                data.status === "awaitComplate" || data.status === "awaitStart" ? "inline-grid" : "none",
            }}
            onClick={() => {
              submit("start", data);
            }}
          >
            <HourglassEmptySharpIcon
              color={!data.actualStartDate ? 'action' : 'disabled' }
            />
            <Typography variant="caption">{i18n.ISNTAPP_START}</Typography>
          </Button>

          <Button
            disabled={!data.actualStartDate}
            size="small"
            style={{
              display: "inline-grid",
              textAlign: "center"
            }}
            onClick={() => {
              store.dispatch(action.setTaskDefaultTab(status));
              history.push(
                `/documents/${data.activityNo}/${data.orderNo}/${data?.productFamily}/listCard`
              );
            }}
          >
            <DescriptionOutlined style={{ margin: "auto" }} color={data.actualStartDate ? 'action' : 'disabled'} />
            <Typography variant="caption">{document}</Typography>
          </Button>
          <Button
            disabled={
              data.status === "awaitComplate" ? (data.actualStartDate && !data.actualEndDate ? false : true) :
                data.status === "awaitClose"? false: true
            }
            size="small"
            style={{
              display: data.status === "closed" ? "none" : "inline-grid",
            }}
            onClick={() => {
              submit(data.status === "awaitComplate" ? "finish" : "close", data);
            }}
          >
            <CheckCircleOutlineOutlined
              color={data.status === "awaitComplate" ?
                (data.actualStartDate && !data.actualEndDate ? 'action' : 'disabled') :
                data.status === "awaitClose" ? 'action' : 'disabled'
              }
            />
            <Typography variant="caption">{data.status === "awaitComplate" || data.status === "awaitStart" ? i18n.ISNTAPP_COMPLETE : i18n.ISNTAPP_CLOSE}</Typography>
          </Button>
        </CardActions>
      </Card>
    );
  }
);
export default TaskListCard;
