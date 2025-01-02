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
  AssignmentTurnedInOutlined,
  CancelOutlined,
  CheckCircleOutlineOutlined,
  DeleteForeverOutlined,
  EventAvailableOutlined,
  EventNoteOutlined,
  ForwardOutlined,
} from "@material-ui/icons";
import { LocalizeContext } from "i18n";
import React from "react";
import { connect } from "react-redux";

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
    AssignerName,
    AssigneeName,
    type,
    status,
    handleClickOpen,
    description,
  }) => {
    const i18n = React.useContext(LocalizeContext);

    return (
      <Card className={classes.card}>
        <CardContent>
          <Grid container>
            <Grid
              item
              xs={8}
              style={{
                display: "inline-flex",
              }}
            >
              <AssignmentTurnedInOutlined
                classes={{ root: classes.iconColor }}
                style={{
                  fontSize: "1.4rem",
                  marginRight: "4px",
                }}
              />
              <Typography variant="body1" fontWeight={500}>
                {data.Description}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                display: "inline-flex",
              }}
            >
              <EventNoteOutlined
                classes={{ root: classes.iconColor }}
                style={{
                  fontSize: "1.05rem",
                  marginRight: "4px",
                }}
              />
              <Typography
                classes={{
                  root:
                    status === "open" &&
                    new Date().toLocaleDateString() >
                      new Date(data.DueDate).toLocaleDateString()
                      ? classes.fontColor
                      : "",
                }}
                variant="body2"
              >
                {data.DueDate}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Box mt={0.5}>
                <Typography
                  variant="body2"
                  classes={{ root: classes.contentColor }}
                >
                  {data.Details}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                display: "inline-flex",
                marginTop: "4px",
              }}
            >
              <EventAvailableOutlined
                classes={{ root: classes.iconColor }}
                style={{
                  fontSize: "1.05rem",
                  marginRight: "4px",
                }}
              />
              <Typography variant="body2">{data.CPLDate}</Typography>
            </Grid>
            {data.ProjectNo && (
              <Grid item xs={12}>
                <Box mt={0.5} style={{ display: "inline-flex" }}>
                  <Typography variant="body2" style={{ marginRight: "4px" }}>
                    {i18n.PROJECTLIST_PROJECT}:
                  </Typography>
                  <Typography
                    variant="body2"
                    classes={{ root: classes.contentColor }}
                  >
                    {/* {<ProjectSiteAddress projectNumber={data.ProjectNo} />} */}
                    {description}
                  </Typography>
                </Box>
              </Grid>
            )}
            {data.OrderNo && (
              <Grid item xs={12}>
                <Box mt={0.5} style={{ display: "inline-flex" }}>
                  <Typography variant="body2" style={{ marginRight: "4px" }}>
                    订单:
                  </Typography>
                  <Typography
                    variant="body2"
                    classes={{ root: classes.contentColor }}
                  >
                    {data.OrderNo}
                  </Typography>
                </Box>
              </Grid>
            )}
            {(status === "pending" || status === "close") && (
              <Grid item xs={12}>
                <Box mt={0.5}>
                  <Typography
                    variant="body2"
                    component="span"
                    style={{ marginRight: "4px" }}
                  >
                    {i18n.ISNTAPP_COMPLETE_COMMENT}:
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    classes={{ root: classes.contentColor }}
                  >
                    {data.AssigneeCMNT}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              style={{ display: "inline-flex", marginTop: "8px" }}
            >
              <Typography
                variant="body2"
                style={{ marginRight: "4px" }}
                classes={{ root: classes.contentColor }}
              >
                {AssignerName}
              </Typography>
              <ForwardOutlined
                classes={{ root: classes.fontColor }}
                style={{ fontSize: "1.2rem" }}
              />
              <Typography
                variant="body2"
                style={{ marginLeft: "4px" }}
                classes={{ root: classes.contentColor }}
              >
                {AssigneeName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          style={{
            backgroundColor: "#f5f5f5",
            overflow: "auto",
            display:
              (type === "assignee" && status === "pending") ||
              status === "close"
                ? "none"
                : "flex",
            padding: "2px",
          }}
        >
          {type === "assignee" && status === "open" && (
            <Button
              size="small"
              style={{
                display: "inline-grid",
              }}
              onClick={() => {
                handleClickOpen("done", data.Description, data);
              }}
            >
              <CheckCircleOutlineOutlined
                classes={{ root: classes.iconColor }}
              />
              <Typography variant="caption">{i18n.ISNTAPP_COMPLETE}</Typography>
            </Button>
          )}
          {type === "assigner" && status === "open" && (
            <Button
              size="small"
              style={{
                display: "inline-grid",
              }}
              onClick={() => {
                handleClickOpen("delete", data.Description, data);
              }}
            >
              <DeleteForeverOutlined classes={{ root: classes.iconColor }} />
              <Typography variant="caption">{i18n.ISNTAPP_DELETE}</Typography>
            </Button>
          )}
          {type === "assigner" && status === "pending" && (
            <Button
              size="small"
              style={{
                display: "inline-grid",
              }}
              onClick={() => {
                handleClickOpen("close", data.Description, data);
              }}
            >
              <CancelOutlined classes={{ root: classes.iconColor }} />
              <Typography variant="caption">{i18n.ISNTAPP_CLOSE}</Typography>
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }
);
export default connect(({ partners, projects }, { data }) => {
  const Assigner = Object.keys(partners).filter((key) => {
    return (
      partners[key].number === data.PartnerNo &&
      (partners[key].functionNumber === "Z(" ||
        partners[key].functionNumber === "VW" ||
        partners[key].functionNumber === "YI")
    );
  });

  const Assignee = Object.keys(partners).filter((key) => {
    return (
      partners[key].number === data.AssigneeID &&
      (partners[key].functionNumber === "Z(" ||
        partners[key].functionNumber === "VW" ||
        partners[key].functionNumber === "YI")
    );
  });

  return {
    AssignerName: partners[Assigner[0]]?.name1,
    AssigneeName: partners[Assignee[0]]?.name1,
    description: projects?.[data?.ProjectNo]?.description,
  };
})(TaskListCard);
