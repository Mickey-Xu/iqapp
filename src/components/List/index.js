import { Box, Grid, withStyles } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import { LocalizeContext } from "i18n";

const Title = withStyles(({ spacing }) => {
  return {
    root: {
      width: "calc(100% + -24px)",
      borderBottom: "1px solid darkgray",
      fontWeight: 500,
      position: "fixed",
      top: spacing(7),
      backgroundColor: "#fafafa",
    },
  };
})(({ classes, type, orderNumber }) => {
  const i18n = React.useContext(LocalizeContext);

  return (
    <Grid container spacing={1} className={classes.root}>
      <Grid item xs={12}>
        <Box
          fontSize="h6.fontSize"
          fontWeight="fontWeightMedium"
          my={1}
        >{`${orderNumber}`}</Box>
      </Grid>
      <Grid item xs={4}>
        {type ? i18n.JOBLIST_ACTIVITY : i18n.ISNTAPP_JOBLIST_INST_STEPS}
      </Grid>
      <Grid item xs={4}>
        {i18n.PROJECTLIST_PLANNED_FINISH}
      </Grid>
      <Grid item xs={4}>
        {i18n.PROJECTLIST_CONFIRMED_FINISH}
      </Grid>
    </Grid>
  );
});

const List = ({ data, component: Component, type }) => {
  let { number } = useParams();
  return (
    <Box>
      <Title type={type} orderNumber={number} />
      <Box style={{ marginTop: "80px" }}>
        {data.map((item, index) => {
          return <Component data={item} key={index} />;
        })}
      </Box>
    </Box>
  );
};
export default List;
