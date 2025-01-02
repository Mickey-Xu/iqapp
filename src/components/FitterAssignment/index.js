import { Box, Button, Checkbox, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import React, { useState } from "react";
import { connect } from "react-redux";
import { LocalizeContext } from "i18n";

const FitterAssignment = withStyles(({ spacing, palette }) => {
  return {
    root: {
      display: "flex",
      borderBottomColor: palette.grey["300"],
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      padding: spacing(1, 0),
    },
  };
})(({ defaultAssignedList, classes, data, projectNumber, confirm }) => {
  const i18n = React.useContext(LocalizeContext);

  const [fitterConfirmList, setFitterConfirmList] = useState(
    defaultAssignedList
  );

  const assignedList = (sqmNr) => {
    let newFitterConfirmList = fitterConfirmList.slice(0);
    const fitterIndex = newFitterConfirmList.indexOf(sqmNr);
    if (fitterIndex > -1) {
      newFitterConfirmList.splice(fitterIndex, 1);
    } else {
      newFitterConfirmList.push(sqmNr);
    }
    setFitterConfirmList(newFitterConfirmList);
  };

  return (
    <Box my={2}>
      <Box textAlign={"right"}>
        <Button
          style={{ textTransform: "none" }}
          color="primary"
          onClick={() => {
            confirm({ projectNo: projectNumber, sqmNr: fitterConfirmList });
          }}
        >
          {i18n.GENERAL_CONFIRM}
        </Button>
      </Box>
      {data.map((item, key) => {
        return (
          <Box className={classes.root} key={key}>
            <Grid container spacing={0} style={{ flex: "auto" }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  {item.fitterName}
                </Grid>
                <Grid item xs={6}>
                  {item.sqmNr}
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  {item.fitterRole}
                </Grid>
                <Grid item xs={6}>
                  {item.productFamilyName}
                </Grid>
              </Grid>
            </Grid>
            <Box style={{ flex: "auto" }}>
              <Checkbox
                color="primary"
                checked={fitterConfirmList.includes(item.sqmNr)}
                onChange={() => {
                  assignedList(item.sqmNr);
                }}
              ></Checkbox>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
});

const mapStateToProps = (
  { fittersAssignmentTransfer, fittersCertification, productFamilies },
  { projectNumber }
) => {
  let fitterAssignmentList = [];
  let defaultAssignedList = [];

  const joinProductFramilyName = (item) => {
    let framilyNames = "";
    let bias = "";
    const productFamilyLists = item.productFamily.split("/");
    if (productFamilyLists.length > 1) {
      productFamilyLists.forEach((key, index) => {
        if (index !== 0) {
          bias = "/";
        }
        framilyNames += bias + productFamilies[key].name;
      });
    } else {
      framilyNames = productFamilies[item.productFamily].name;
    }
    return framilyNames;
  };

  Object.keys(fittersCertification).forEach((key) => {
    if (fittersCertification[key].fitterRole === "TL") {
      fittersCertification[key].productFamilyName = joinProductFramilyName(
        fittersCertification[key]
      );
      fitterAssignmentList.unshift(fittersCertification[key]);
    } else {
      fittersCertification[key].productFamilyName = joinProductFramilyName(
        fittersCertification[key]
      );
      fitterAssignmentList.push(fittersCertification[key]);
    }
  });

  (fittersAssignmentTransfer[projectNumber]
    ? fittersAssignmentTransfer[projectNumber]
    : []
  ).forEach((item) => {
    defaultAssignedList.push(item.sqmNr);
  });

  return {
    data: fitterAssignmentList,
    defaultAssignedList: defaultAssignedList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    confirm: (data) => {
      dispatch(action.confirmFittersAssignmentList(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FitterAssignment);
