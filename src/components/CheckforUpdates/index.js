import { Box, Button, makeStyles } from "@material-ui/core";
import * as action from "actions";
import ConfirmModal from "components/ConfirmModal";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(({ spacing }) => ({
  btn: {
    width: "80%",
    position: "fixed",
    bottom: spacing(17),
    marginLeft: "10%",
  },
}));

const CheckforUpdates = ({
  type,
  onClick,
  isServiceWorkerUpdated = "",
  page = "",
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!onClick) {
      const timer = setTimeout(() => {
        dispatch(
          `${type === "SW_INIT" ? action.setSwInIt() : action.setSwUpdate()}`
        );
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [onClick, dispatch, type]);

  const closeMenu = () => {
    setOpen(false);
    dispatch(action.setInfo("正在安装中"));
    setTimeout(() => {
      onClick();
    }, 2000);
  };

  return (
    <Box>
      {page === "activity" ? (
        <ConfirmModal
          hiddenCancel={true}
          open={open}
          mask={true}
          handleClick={closeMenu}
        >
          您有新的版本
        </ConfirmModal>
      ) : (
        <Box className={classes.btn}>
          <Button
            style={{
              textTransform: "capitalize",
              backgroundColor: "rgb(220,2,2)",
              color: "white",
              padding: "3px",
            }}
            fullWidth
            onClick={onClick}
            size="large"
            variant="contained"
          >
            {isServiceWorkerUpdated}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckforUpdates;
