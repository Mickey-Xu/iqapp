import { List } from "@material-ui/core";
import ProjectListItem from "components/ProjectListItem";
import React from "react";
import { connect } from "react-redux";

const ProjectList = ({ data }) => {
  return (
    <List>
      {data.map((item, index) => {
        return <ProjectListItem key={index} projectNumber={item} />;
      })}
    </List>
  );
};

export default connect(({ projects }, { searchCriteria }) => {
  return {
    data: !searchCriteria
      ? Object.keys(projects)
      : Object.keys(projects).filter((key) => {
          return (
            projects[key].number.indexOf(searchCriteria) > -1 ||
            projects[key].description.indexOf(searchCriteria) > -1
          );
        }),
  };
})(ProjectList);
