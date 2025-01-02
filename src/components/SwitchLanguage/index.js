import { MenuItem, Select, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import { db } from "js/db";
import React from "react";
import { connect } from "react-redux";

const SwitchLanguage = withStyles(() => {
  return {
    root: {
      minWidth: "120px",
    },
  };
})(({ classes, setLanguage, language, menuItemData }) => {
  return (
    <Select
      className={classes.root}
      onChange={(e) => setLanguage(e.target.value)}
      value={language}
    >
      {menuItemData.map((item, index) => {
        return (
          <MenuItem value={item.value} key={index}>
            <Typography variant="subtitle1" align="center">
              {item.label}
            </Typography>
          </MenuItem>
        );
      })}
    </Select>
  );
});

export default connect(
  ({ settings: { language } }) => {
    return {
      language,
    };
  },
  (dispatch) => {
    return {
      setLanguage: (languageType) => {
        db.cache
          .put({
            id: "settings",
            data: { language: languageType },
          })
          .then(() => {
            dispatch(action.setLanguage(languageType));
          });
      },
    };
  }
)(SwitchLanguage);
