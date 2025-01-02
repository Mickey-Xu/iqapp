import { Box, Toolbar, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
  },
  content: {
    marginTop: theme.spacing(10),
  },
}));

const Model = ({ handleClose, open, title, children }) => {
  const classes = useStyles();
  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <Box className={classes.content}>{children}</Box>
    </Dialog>
  );
};

export default Model;
