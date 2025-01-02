import { Box, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { connect } from "react-redux";
import { LocalizeContext } from "i18n";

const FitterOverview = withStyles(({ spacing, palette }) => {
  return {
    root: {
      borderBottomColor: palette.grey["300"],
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      padding: spacing(1, 0),
    },
  };
})(({ assignedTotal, classes, data, projectNumber }) => {
  const i18n = React.useContext(LocalizeContext);

  return (
    <Box>
      <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium" my={2}>
        {i18n.ISNTAPP_PROJECTLIST_FITTER_ASSIGNED_TOTAL}: {assignedTotal}
      </Box>
      {data.map((item, key) => {
        return (
          <Box className={classes.root} key={key}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                {item.name}
              </Grid>
              <Grid item xs={4}>
                {i18n.INSTAPP_PROJECTLIST_UnitCount}: {item.units}
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                {i18n.ISNTAPP_PROJECTLIST_FITTER_NEED}: {item.need}
              </Grid>
              <Grid item xs={4}>
                {i18n.ISNTAPP_PROJECTLIST_FITTER_Qualified}: {item.qualified}
              </Grid>
              <Grid item xs={4}>
                {i18n.ISNTAPP_PROJECTLIST_FITTER_Assigned}: {item.assigned}
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
});

const mapStateToProps = (
  {
    fittersAssignmentTransfer,
    fittersDemand,
    fittersCertification,
    orders,
    productFamilies,
  },
  { projectNumber }
) => {
  let productFamilyList = [];

  Object.keys(orders).forEach((item) => {
    if (orders[item].projectNumber === projectNumber) {
      productFamilyList.push(orders[item].productFamily);
    }
  });

  const productFamilyCountList = productFamilyList.reduce(function (
    prev,
    next
  ) {
    prev[next] = prev[next] + 1 || 1;
    return prev;
  },
  {});

  const currentFamilyAssigned = (productFamily) => {
    let assignedCount = 0;
    Object.keys(fittersCertification).forEach((key) => {
      Object.keys(
        fittersAssignmentTransfer[projectNumber]
          ? fittersAssignmentTransfer[projectNumber]
          : {}
      ).forEach((item) => {
        if (
          fittersAssignmentTransfer[projectNumber][item].sqmNr === key &&
          fittersCertification[key].productFamily.includes(productFamily)
        ) {
          assignedCount += 1;
        }
      });
    });
    return assignedCount;
  };

  return {
    data: Object.keys(productFamilyCountList).map((item) => {
      const name = productFamilies[item].name;
      const units = productFamilyCountList[item];
      return {
        name: name,
        units: units,
        need:
          units * (fittersDemand[item] ? fittersDemand[item].fittersNeed : 1),
        qualified: Object.keys(fittersCertification).filter((key) => {
          return fittersCertification[key].productFamily.indexOf(item) !== -1;
        }).length,
        assigned: currentFamilyAssigned(item),
      };
    }),
    assignedTotal: fittersAssignmentTransfer[projectNumber]
      ? fittersAssignmentTransfer[projectNumber].length
      : 0,
  };
};

export default connect(mapStateToProps)(FitterOverview);
