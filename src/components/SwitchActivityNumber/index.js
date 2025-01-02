import { FormControl, MenuItem, Select } from "@material-ui/core"; //Button, Grid,
import { withStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { connect } from "react-redux";

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
    activityNumberAndUnitDesignationMapping,
    isInstallationStep,
    initValue,
    stepNumberList,
    onChange,
  }) => {
    const [selectedValue, setSelectedValue] = useState(initValue);

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
              setSelectedValue(e.target.value);
              onChange(e.target.value);
            }}
            value={selectedValue}
          >
            {activityNumberList.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>{`${item} ${
                  isInstallationStep
                    ? ""
                    : activityNumberAndUnitDesignationMapping[
                        activityNumberList[index]
                      ]
                }`}</MenuItem>
              );
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

export default connect(mapStateToProps)(SwitchActivityNumber);
