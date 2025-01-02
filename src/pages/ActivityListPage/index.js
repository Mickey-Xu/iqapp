import { Box, makeStyles } from "@material-ui/core";
import * as action from "actions";
import ActivityList from "components/ActivityList";
import CheckforUpdates from "components/CheckforUpdates";
import FFTab from "components/FFTab";
import { LocalizeContext } from "i18n";
import * as repo from "js/fetch";
import { scrollToPosition } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles(({ theme, spacing }) => ({
  main: {
    backgroundColor: "#f3f3f3",
    padding: 6,
    position: "absolute",
    top: spacing(6),
    height: window.screen.height - 173 + "px",
    width: "100%",
    overflow: "hidden auto",
  },
}));

const ActivityListPage = ({
  timeHorizon,
  setTimeHorizon,
  historyPage,
  serviceWorkerRegistration,
  isServiceWorkerUpdated,
}) => {
  const i18n = React.useContext(LocalizeContext);
  const classes = useStyles();
  const scrollRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      scrollToPosition(scrollRef, location.pathname);
    }, 1000);
  }, [location.pathname]);

  const tabs = [
    { title: i18n.COCKPIT_FILTER_NONE, value: "all" },
    { title: i18n.COCKPIT_FILTER_THISWEEK, value: "thisWeek" },
    { title: "2 " + i18n.INSTALLATION_WEEKS, value: "twoWeeks" },
    { title: "4 " + i18n.INSTALLATION_WEEKS, value: "fourWeeks" },
    { title: "8 " + i18n.INSTALLATION_WEEKS, value: "eightWeeks" },
  ];

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
    <PrimaryLayout
      name="activities"
      title={i18n.INSTAPP_JOBLIST_ACTIVITY_COCKPIT}
      pageLevel={1}
    >
      <Box
        style={{
          width: "100%",
          position: "fixed",
          zIndex: "100",
          backgroundColor: "#fafafa",
          height: "48px",
        }}
      >
        <FFTab
          tabs={tabs}
          selectedTabValue={timeHorizon}
          onTabChange={(value) => setTimeHorizon(value)}
        />
      </Box>
      <div className={classes.main} ref={scrollRef}>
        <ActivityList />
      </div>

      <div>
        {historyPage === "loginPage" && isServiceWorkerUpdated && (
          <CheckforUpdates
            type="SW_UPDATE"
            page="activity"
            open={isServiceWorkerUpdated}
            onClick={updateServiceWorker}
          />
        )}
      </div>
    </PrimaryLayout>
  );
};

const mapStateToPops = (state, ownProps) => {
  const {
    timeHorizon,
    settings,
    versionUpdating: { serviceWorkerUpdated, serviceWorkerRegistration },
  } = state;
  const historyPage = settings.historyPage ? settings.historyPage : "";

  return {
    timeHorizon,
    historyPage,
    isServiceWorkerUpdated: serviceWorkerUpdated,
    serviceWorkerRegistration,
  };
};

const mapDispatchToState = (dispatch) => {
  return {
    refresh: () => {
      dispatch(action.fetchAll(repo.type.CACHE));
    },
    setTimeHorizon: (timeHorizon) => {
      dispatch(action.setTimeHorizon(timeHorizon));
    },
    setScrollPosition: (data) => {
      dispatch(action.setScrollPosition(data));
    },
  };
};

export default connect(mapStateToPops, mapDispatchToState)(ActivityListPage);
