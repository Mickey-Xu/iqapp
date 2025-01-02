import { Tab, Tabs } from "@material-ui/core";
import FitterAssignment from "components/FitterAssignment";
import FitterOverview from "components/FitterOverview";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useState } from "react";
import { connect } from "react-redux";
import { LocalizeContext } from "i18n";

const FitterAssignmentPage = ({ projectNumber }) => {
  const i18n = React.useContext(LocalizeContext);
  const [activeTab, setActiveTab] = useState("overView");

  return (
    <PrimaryLayout title={i18n.ISNTAPP_PROJECTLIST_FITTER_ASSIGNMENT}>
      <Tabs
        indicatorColor="primary"
        onChange={(e, value) => {
          setActiveTab(value);
        }}
        textColor="primary"
        value={activeTab}
        variant="fullWidth"
      >
        <Tab label={i18n.GENERAL_OVERVIEW} value="overView" />
        <Tab
          label={i18n.ISNTAPP_PROJECTLIST_FITTER_ASSIGNMENT2}
          value="fitterAssignment"
        />
      </Tabs>
      {activeTab === "overView" && (
        <FitterOverview projectNumber={projectNumber}></FitterOverview>
      )}
      {activeTab === "fitterAssignment" && (
        <FitterAssignment projectNumber={projectNumber}></FitterAssignment>
      )}
    </PrimaryLayout>
  );
};

const mapStateToProps = ({ projects }, ownProps) => {
  const { match } = ownProps;
  const { params } = match;
  const { number: projectNumber } = params;
  return { projectNumber };
};

export default connect(mapStateToProps)(FitterAssignmentPage);
