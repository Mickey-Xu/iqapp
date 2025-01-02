import { withStyles } from "@material-ui/core/styles";
// import ProjectCard from "components/ProjectCard";
import ProjectSummary from "components/ProjectSummary";
import React from "react";

const ProjectListItem = withStyles(({ palette, spacing }) => {
  return {
    root: {
      backgroundColor: palette.background.default,
      marginBottom: spacing(2),
    },
  };
})(({ classes, projectNumber }) => {
  return (
    <div className={classes.root}>
      <ProjectSummary projectNumber={projectNumber} />
    </div>
  );
});

export default ProjectListItem;
