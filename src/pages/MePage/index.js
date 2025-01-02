import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import * as action from "actions";
import fitter from "assets/svg/fitter.svg";
import SwitchLanguage from "components/SwitchLanguage";
import { LocalizeContext } from "i18n";
import { calculationOfInstallationSteps } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import projectIcon from "../../img/projectIcon.png";
import userManualIcon from "../../img/userManual.png";
import about from "../././../assets/svg/about.svg";
import downLoad from "../././../assets/svg/downLoad.svg";
import Elevator from "../././../assets/svg/Elevator.svg";
import key from "../././../assets/svg/key.svg";
import language from "../././../assets/svg/language.svg";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: "100%",
  },

  instructions: {
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  header: {
    display: "flex",
  },
  headerContainer: {
    width: "100%",
    margin: spacing(2, 0, 1, 0),
    padding: spacing(2, 2, 1, 2),
    backgroundColor: "#FFF",
  },
  units: {
    display: "flex",
    alignItems: "center",
  },
  listItem: {
    backgroundColor: "#fff",
    margin: spacing(0, 0, 2, 0),
  },
  listItemText: {
    margin: spacing(0, 0, 0, 2),
  },
  name: {
    marginLeft: spacing(2),
    whiteSpace: "nowrap",
  },
  userName: {
    marginLeft: spacing(7),
  },
  btn: {
    display: "block",
    textTransform: "capitalize",
    margin: spacing(3, "auto"),
    fontSize: spacing(2),
    color: "red",
  },
  asdf: {
    display: "flex",
    margin: "8px",
    width: " 100%",
  },
}));

const MePage = ({
  company,
  userName,
  roles,
  ProjectQuantity,
  progress,
  logout,
}) => {
  const classes = useStyles();
  const i18n = React.useContext(LocalizeContext);
  const [peInfo] = React.useState(JSON.parse(window.localStorage.getItem("peInfo")));

  const list = [
    {
      name: i18n.ISNTAPP_LANGUAGE,
      imgSrc: language,
      type: "Language",
    },
    {
      name: i18n.ISNTAPP_SYNCHRONIZE,
      imgSrc: downLoad,
      link: "synchronize",
    },
    {
      name: i18n.ISNTAPP_CHANGE_PASSWORD,
      imgSrc: key,
      link: "ChangePassword",
    },
    {
      name: i18n.ISNTAPP_ABOUT,
      id: 18,
      imgSrc: about,
      link: "about",
    },
    {
      name: i18n.INSTALLATION_USER_MANUAL,
      imgSrc: userManualIcon,
      link: "userManual",
    },
  ];

  const menuItemData = [
    { label: i18n.ISNTAPP_LANGUAGE_ZH_CN, value: "zh-cn" },
    { label: i18n.ISNTAPP_LANGUAGE_EN, value: "en" },
  ];

  const history = useHistory();
  return (
    <PrimaryLayout name="me" title={i18n.ISNTAPP_ME}>
      <Grid container spacing={1} className={classes.headerContainer}>
        <Grid style={{ display: "flex", margin: "8px", width: " 100%" }}>
          <img src={fitter} style={{ width: "22px", height: "24px" }} alt="" />
          <Typography align="center" className={classes.name}>
            {userName}
          </Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography
            variant="subtitle1"
            align="left"
            style={{ marginLeft: "42px" }}
          >
            {roles === "Subcon TL" ? i18n.JOBLIST_SUBCON_TL : roles}
          </Typography>
        </Grid>

        <Grid item xs={5}>
          <Typography variant="subtitle1" align="center">
            {company}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={3}>
          <Box className={classes.units}>
            <img src={Elevator} width="24" alt=""></img>
            <Typography
              variant="subtitle1"
              align="center"
              className={classes.name}
            >
              {i18n.ISNTAPP_UNITS}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} align="center">
          <Typography variant="subtitle1">
            {progress.theOverallProgress}
          </Typography>
        </Grid>
        <Grid item xs={6} align="center">
          <Typography variant="subtitle1">
            {roles==="SL"&&peInfo?.pNumber&&`PE工号：${peInfo?.pNumber}`} 
          </Typography>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={3}>
          <Box className={classes.units}>
            <img
              src={projectIcon}
              width="24"
              style={{ marginLeft: "2px", transform: " scaleX(-1)" }}
              alt=""
            ></img>
            <Typography
              variant="subtitle1"
              align="center"
              className={classes.name}
            >
              {i18n.ISNTAPP_PROJECTS}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} align="center">
          <Typography variant="subtitle1">{ProjectQuantity}</Typography>
        </Grid>
      </Grid>

      <List className={classes.root}>
        {list.map((item, index) => {
          return (
            <ListItem
              key={index}
              className={classes.listItem}
              onClick={() => {
                history.push(item.link);
              }}
            >
              <img src={item.imgSrc} width="24" alt="" />
              <ListItemText
                primary={item.name}
                className={classes.listItemText}
              />
              <ListItemAvatar align="right">
                {item.type ? (
                  <SwitchLanguage menuItemData={menuItemData} />
                ) : (
                  <ArrowForwardIosIcon fontSize="inherit" />
                )}
              </ListItemAvatar>
            </ListItem>
          );
        })}
      </List>
      <Box>
        <Button
          color="secondary"
          className={classes.btn}
          onClick={() => logout()}
        >
          {i18n.ISNTAPP_SIGN_OUT}
        </Button>
      </Box>
    </PrimaryLayout>
  );
};

export default connect(
  ({
    auth: {
      userName,
      roles,
      company: { name },
    },
    orderActivities,
    projects,
    orders,
  }) => {
    const ProjectQuantity = Object.keys(projects).length;
    const progress = calculationOfInstallationSteps(orderActivities, orders);
    return {
      userName,
      roles: roles[0],
      orderActivities,
      ProjectQuantity,
      progress,
      company: name,
    };
  },
  (dispatch) => {
    return {
      logout: () => {
        dispatch(action.logout());
      },
    };
  }
)(MePage);
