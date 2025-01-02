import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { LocalizeContext } from "i18n";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmModal = ({
  children,
  open,
  handleClick,
  onClose,
  title,
  mask,
  hiddenCancel = false,
}) => {
  const i18n = React.useContext(LocalizeContext);

  return (
    <Dialog
      fullWidth={true}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => !mask && onClose()}
    >
      <DialogTitle style={{ textAlign: "center" }}>{title}</DialogTitle>
      <DialogContent>
        <Box>{children}</Box>
      </DialogContent>
      <DialogActions style={{ padding: "16px" }}>
        {!hiddenCancel && (
          <Button variant="contained" onClick={onClose}>
            {i18n.GENERAL_CANCEL}
          </Button>
        )}

        <Button variant="contained" color="primary" onClick={handleClick}>
          {i18n.GENERAL_CONFIRM}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
