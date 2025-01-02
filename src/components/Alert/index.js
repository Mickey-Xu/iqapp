import { Snackbar } from "@material-ui/core";
import { alertAutoHideDuration } from "config";
import React from "react";
import { connect } from "react-redux";
import * as action from "actions";

const Alert = ({ message, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      autoHideDuration={alertAutoHideDuration}
      message={message}
      onClose={onClose}
      open={!!message}
    />
  );
};

export default connect(
  ({ alert }) => ({
    message: alert.message,
  }),
  (dispatch) => {
    return {
      onClose: () => {
        dispatch(action.hideAlert());
      },
    };
  }
)(Alert);
