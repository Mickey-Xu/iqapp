import { IconButton, InputBase, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import React from "react";

const ProjectSearchBar = withStyles(({ spacing, typography }) => {
  return {
    root: {
      alignItems: "center",
      display: "flex",
      maxWidth: "100%",
      margin: spacing(2, 0),
    },
    input: {
      marginLeft: spacing(1),
      flex: 1,
      fontSize: typography.caption.fontSize,
    },
    iconButton: {
      padding: spacing(0.5),
    },
  };
})(({ classes, onChange, placeholder }) => {
  return (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <IconButton className={classes.iconButton}>
        <Search fontSize="small" />
      </IconButton>
    </Paper>
  );
});

export default ProjectSearchBar;
