import { FormControl, MenuItem, Select } from "@material-ui/core"; //Button, Grid,
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { allActivitiesNosInProjectProgress } from "js/publicFn";

const SwitchActivityNumber = withStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "flex-end",
    },
    text: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
})(
  ({
    classes,
    activityNumberList,
    auth,
    activityNumberAndunitDesignationMappig,
    cleanSlectedCheckBoxList,
    flag,
    initStep,
    setProjectFilterValue,
    setGroupCheckList,
    stepNumberList,
  }) => {
    const [filterlistInex, setfilterlistInex] = useState(initStep);
    // activityNumberAndunitDesignationMappig[activityNumberList[index]]

    useEffect(() => {
      setProjectFilterValue(filterlistInex);
    });

    const ActivityNumberDropDown = () => {
      return (
        <FormControl
          style={{
            marginLeft: "20px",
            width: "170px",
          }}
        >
          <Select
            onChange={(e) => {
              cleanSlectedCheckBoxList();
              setGroupCheckList([]);
              setfilterlistInex(e.target.value);
              setProjectFilterValue(e.target.value);
            }}
            value={filterlistInex}
          >
            {flag
              ? stepNumberList.sort().map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>{`${item}`}</MenuItem>
                  );
                })
              : activityNumberList.map((item, index) => {
                  if (
                    allActivitiesNosInProjectProgress(
                      auth.activityAuth,
                      auth.roles[0]
                    ).includes(item)
                  ) {
                    return (
                      <MenuItem key={index} value={item}>{`${item} ${
                        activityNumberAndunitDesignationMappig[
                          activityNumberList[index]
                        ]
                      }`}</MenuItem>
                    );
                  } else {
                    return null;
                  }
                })}
          </Select>
        </FormControl>
      );
    };
    return (
      <div className={classes.root}>
        <ActivityNumberDropDown />
      </div>
    );
  }
);

const mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setProjectFilterValue: (activityNumber) => {
      dispatch(action.setProjectFilterValue(activityNumber));
    },
    cleanSlectedCheckBoxList: () => {
      dispatch(action.cleanSlectedCheckBoxList());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchActivityNumber);
