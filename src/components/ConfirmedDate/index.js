import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { MoreVert } from "@material-ui/icons";
import * as action from "actions";
import Menus from "components/Menus";
import NativeDateInput from "components/NativeDateInput";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import * as publicFn from "../../js/publicFn/index";

const ConfirmedDate = withStyles(({ spacing }) => ({
  box: {
    display: "flex",
    justifyContent: "space-between",
  },
  clearIcon: {
    marginLeft: spacing(0.5),
  },
}))(
  ({
    accessData,
    activityNumber,
    classes,
    confirmedDate,
    dispatch,
    orderNumber,
    originalStep,
    type,
  }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const dateInputRef = useRef(null);
    const closeMenu = () => {
      setAnchorEl(null);
    };

    const openMenu = (e) => {
      setAnchorEl(e.currentTarget);
    };

    const submit = (value) => {
      let data = {
        activityNo: activityNumber,
        date: value ? value : "",
        orderNo: orderNumber,
        type: 1,
      };
      dispatch(action.updateOrderActivityStatus(data));
      closeMenu();
    };

    return (
      <Box className={classes.box}>
        <NativeDateInput
          onChange={(value) => submit(value)}
          value={confirmedDate}
          dateInputRef={dateInputRef}
        />
        {type === "orderInstall" ? (
          originalStep && (
            <MoreVert
              className={classes.clearIcon}
              fontSize="small"
              onClick={openMenu}
            />
          )
        ) : (
          <MoreVert
            className={classes.clearIcon}
            fontSize="small"
            onClick={openMenu}
          />
        )}

        <Menus
          accessData={accessData}
          anchorEl={anchorEl}
          closeMenu={closeMenu}
          submit={submit}
          modifyTime={() => {
            closeMenu();
            dateInputRef.current.focus();
            dateInputRef.current.click();
          }}
          type="confirmedDate"
        />
      </Box>
    );
  }
);

export default connect(
  (
    { auth, orderActivities, documentList, orders, templates },
    { activityNumber, confirmedDate, orderNumber }
  ) => {
    const projectNumber = orders[orderNumber]?.projectNumber;

    let data = {
      auth,
      orderActivities,
      documentList,
      templates,
    };
    let ownprops = {
      orderNumber,
      activityNumber,
      projectNumber,
    };

    let accessData = publicFn.DatePermissionControl(data, ownprops);
    return {
      accessData,
      activityNumber,
      confirmedDate,
      orderNumber,
    };
  }
)(ConfirmedDate);
