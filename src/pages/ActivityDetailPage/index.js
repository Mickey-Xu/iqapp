import OrderList from "components/OrderList";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { scrollToPosition } from "js/util";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(({ theme, spacing }) => ({
  main: {
    // backgroundColor: "#f3f3f3",
    // padding: 6,
    position: "absolute",
    height: window.screen.height - 125 + "px",
    width: "100%",
    overflow: "hidden auto",
  },
}));

const ActivityDetailPage = ({ activityNumber, descriptionShort }) => {
  const i18n = React.useContext(LocalizeContext);

  const scrollRef = useRef(null);
  const classes = useStyles();

  const location = useLocation();

  // const [activityStatus, setActivityStatus] = React.useState("all");

  // const tabs = [
  //   { title: i18n.COCKPIT_FILTER_OPEN, value: "open" },
  //   { title: i18n.COCKPIT_FILTER_CONFIRMED, value: "confirmed" },
  //   { title: i18n.COCKPIT_FILTER_NONE, value: "all" },
  // ];
  useEffect(() => {
    setTimeout(() => {
      scrollToPosition(scrollRef, location.pathname);
    }, 1000);
  }, [location.pathname]);

  return (
    <PrimaryLayout
      title={
        i18n.INSTAPP_JOBLIST_ACTIVITY_DETAIL +
        ": " +
        activityNumber +
        " - " +
        descriptionShort
      }
    >
      {/* <FFTab
        tabs={tabs}
        selectedTabValue={"all"}
        onTabChange={(value) => setActivityStatus(value)}
      /> */}
      <div className={classes.main} ref={scrollRef}>
        <OrderList activityStatus="open" activityNumber={activityNumber} />
      </div>
    </PrimaryLayout>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { activities } = state;
  const { match } = ownProps;
  const { params } = match;
  const { number: activityNumber } = params;
  const { descriptionShort } = activities[activityNumber] || {};

  return { activityNumber, descriptionShort };
};

export default connect(mapStateToProps)(ActivityDetailPage);
