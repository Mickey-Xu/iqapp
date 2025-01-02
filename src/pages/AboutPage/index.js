import { Box, makeStyles, Typography } from "@material-ui/core";
import Logo from "assets/img/Favicon.png";
import CheckforUpdates from "components/CheckforUpdates";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    textAlign: "center",
    margin: spacing(7, 0),
  },
  listItemText: {
    marginLeft: spacing(2),
  },
  list: {
    margin: spacing(0, 2),
  },
  listItem: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  title: {
    margin: spacing(1, 0),
  },
  footer: {
    position: "fixed",
    width: "100%",
    bottom: spacing(11),
    textAlign: "center",
  },
  button: {
    backgroundColor: "rgb(220,2,2)",
    color: "white",
  },
}));

const AboutPage = ({ isServiceWorkerUpdated, serviceWorkerRegistration }) => {
  const classes = useStyles();
  const i18n = React.useContext(LocalizeContext);

  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: "SKIP_WAITING" });

      registrationWaiting.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") {
          window.localStorage.removeItem("versionUpdating");
          window.location.reload();
        }
      });
    }
  };

  return (
    <PrimaryLayout title={i18n.ISNTAPP_ABOUT}>
      <Box className={classes.box}>
        <img src={Logo} width="24%" alt="" />
        <Typography variant="h5" className={classes.title}>
          {i18n.ISNTAPP_INSTALLATION_QUALITY_APP}
        </Typography>
        <Typography variant="body1">{i18n.ISNTAPP_VERSION} 3.2.1</Typography>
      </Box>
      <Typography variant="body2" align="center" color="textSecondary">
        {isServiceWorkerUpdated ? (
          <span style={{ color: "red" }}>{i18n.ISNTAPP_NEW_VERSION_FOUND}</span>
        ) : (
          i18n.ISNTAPP_LATEST_VERSION
        )}
      </Typography>
      <CheckforUpdates
        type="SW_UPDATE"
        isServiceWorkerUpdated={
          isServiceWorkerUpdated
            ? i18n.ISNTAPP_UPDATES
            : i18n.ISNTAPP_CHECK_UPDATES
        }
        onClick={
          isServiceWorkerUpdated
            ? updateServiceWorker
            : () => window.location.reload()
        }
      />
      <Box className={classes.footer}>
        <Typography variant="body2" color="textSecondary">
          {i18n.ISNTAPP_COPYRIGHT}
        </Typography>
      </Box>
    </PrimaryLayout>
  );
};

export default connect(
  (
    {
      versionUpdating: {
        serviceWorkerUpdated,
        serviceWorkerRegistration,
        serviceWorkerInitialized,
      },
    },
    state
  ) => {
    return {
      isServiceWorkerUpdated: serviceWorkerUpdated,
      serviceWorkerRegistration,
      isServiceWorkerInitialized: serviceWorkerInitialized,
    };
  }
)(AboutPage);
