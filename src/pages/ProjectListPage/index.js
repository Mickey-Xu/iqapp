import { Box } from "@material-ui/core";
import ProjectList from "components/ProjectList";
import ProjectSearchBar from "components/ProjectSearchBar";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useState } from "react";

const ProjectListPage = () => {
  const [searchCriteria, setSearchCriteria] = useState(null);
  const i18n = React.useContext(LocalizeContext);

  return (
    <PrimaryLayout
      name="projects"
      title={i18n.LATERALMENU_PROJECT_LIST}
      pageLevel={1}
    >
      <Box
        style={{
          width: "92%",
          position: "fixed",
          left: "16px",
          zIndex: "100",
          backgroundColor: "#fafafa",
          height: "48px",
        }}
      >
        <ProjectSearchBar
          placeholder={i18n.ISNTAPP_SEARCH_PROJECT_LIST}
          onChange={(value) => {
            setSearchCriteria(value);
          }}
        />
      </Box>
      <div
        style={{
          width: "100%",
          padding: "16px",
          position: "absolute",
          top: "40px",
          height: window.screen.height - 165 + "px",
          overflow: "hidden auto",
        }}
      >
        <ProjectList searchCriteria={searchCriteria} />
      </div>
    </PrimaryLayout>
  );
};

export default ProjectListPage;
