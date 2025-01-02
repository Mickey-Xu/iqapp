import { Box, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ProjectSiteAddress from "components/ProjectSiteAddress";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const ProjectCard = withStyles(({ spacing, palette }) => {
  return {
    gridRight: {
      textAlign: "right",
    },
    root: {
      borderBottom: `1px solid${palette.grey["300"]}`,
      padding: spacing(1, 0),
    },
    link: {
      textDecoration: "blink",
    },
    icon: { fontSize: "1rem" },
  };
})(({ classes, link, orderQuantity, projectName, projectNumber }) => {
  return (
    <Box className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Typography variant="body2">{projectNumber}</Typography>
        </Grid>
        <Grid item xs={4} className={classes.gridRight}>
          <Typography variant="body2">Units {orderQuantity}</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2">{projectName}</Typography>
        </Grid>
        <Grid item xs={4} className={classes.gridRight}>
          <Link className={classes.link} to={link}>
            <ArrowForwardIosIcon
              fontSize="small"
              color="action"
              className={classes.icon}
            />
          </Link>
        </Grid>
        <Grid item xs={8}>
          <ProjectSiteAddress projectNumber={projectNumber} />
        </Grid>
      </Grid>
    </Box>
  );
});

export default connect(({ orders, projects }, { link, projectNumber }) => {
  const { description: projectName } = projects[projectNumber];
  return {
    link,
    orderQuantity: Object.keys(orders).filter((key) => {
      return orders[key].projectNumber === projectNumber;
    }).length,
    projectName,
    projectNumber,
  };
})(ProjectCard);
