import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ProjectSiteAddress from "components/ProjectSiteAddress";
import { LocalizeContext } from "i18n";
import gpsIcon from "img/gps.png";
import subcontlIcon from "img/subcontl.png";
import unitIcon from "img/unit.png";
import * as util from "js/util";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    fontSize: theme.spacing(1.8),
    backgroundColor: "white",
    border: " 2px solid #EEE",
    color: "rgba(0, 0, 0, 0.87)",
  },
  link: {
    textDecoration: "blink",
    fontSize: 15,
  },
  content: {
    padding: theme.spacing(0, 2),
  },
}));

function ProjectSummary({
  orderQuantity,
  projectName,
  projectNumber,
  teamLeader,
  progress,
}) {
  const classes = useStyles();
  const i18n = React.useContext(LocalizeContext);
  const history = useHistory();

  return (
    <Card
      className={classes.root}
      onClick={() => {
        history.push(`/projectProgressPage/${projectNumber}`);
      }}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {progress}%
          </Avatar>
        }
        title={projectNumber}
        subheader={projectName}
      />
      <CardContent
        classes={{ root: classes.content }}
        style={{ paddingBottom: "10px" }}
      >
        <Grid container spacing={1}>
          <Grid item style={{ display: "inline-flex" }}>
            <img src={unitIcon} width="18" height="18" alt="" />
            <Box ml={0.5} fontSize="bady2">
              {i18n.ISNTAPP_UNITS}:
            </Box>
          </Grid>
          <Grid item> {orderQuantity}</Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item style={{ display: "inline-flex" }}>
            <img src={subcontlIcon} width="18" height="18" alt="" />
            <Box ml={0.5} fontSize="bady2">
              {i18n.JOBLIST_SUBCON_TL}:
            </Box>
          </Grid>
          <Grid item> {teamLeader}</Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item style={{ display: "inline-flex" }}>
            <img src={gpsIcon} width="18" height="18" alt="" />
            <Box ml={0.5} fontSize="bady2">
              {i18n.ISNTAPP_PROJECT_SITE_ADDRESS}:
              <span style={{ marginLeft: "5px" }}>
                <ProjectSiteAddress projectNumber={projectNumber} />
              </span>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default connect(
  (
    { orders, projects, partners, orderActivities },
    { link, projectNumber }
  ) => {
    const { description: projectName } = projects[projectNumber];
    const OrderNos = Object.keys(orders).filter(
      (item) => orders[item].projectNumber === projectNumber
    );
    const teamLeader = OrderNos.map((item) => {
      return partners[`${item}-VW`]?.name1;
    });

    return {
      link,
      orderQuantity: Object.keys(orders).filter((key) => {
        return orders[key].projectNumber === projectNumber;
      }).length,
      projectName,
      projectNumber,
      teamLeader: [...new Set(teamLeader)].join("/"),
      progress: util.projectProgress(projectNumber, orders, orderActivities),
    };
  }
)(ProjectSummary);
