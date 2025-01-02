import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import React from "react";

const Message = withStyles((theme) => {
  return {
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  };
})(({ classes, message, messageType, messageOpen, handleMessageClose }) => {
  return (
    <div className={classes.root}>
      <Snackbar
        style={{ top: "100px" }}
        open={messageOpen}
        // autoHideDuration={0}
        onClose={handleMessageClose}
        // anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleMessageClose}
          severity={messageType ? messageType : "error"}>
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
});
export default Message;
