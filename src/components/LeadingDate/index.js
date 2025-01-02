import { Box, withStyles } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import * as action from "actions";
import Menus from "components/Menus";
import NativeDateInput from "components/NativeDateInput";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import * as publicFn from "../../js/publicFn/index";

const LeadingDate = withStyles(({ spacing }) => ({
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
    leadingDate,
    orderNumber,
    today,
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
        type: 2,
      };
      dispatch(action.updateOrderActivityStatus(data));
      closeMenu();
    };

    return (
      <Box className={classes.box}>
        <NativeDateInput
          alarm={!confirmedDate && leadingDate < today}
          dateInputRef={dateInputRef}
          onChange={(value) => {
            submit(value);
          }}
          value={leadingDate}
        />
        <MoreVert
          className={classes.clearIcon}
          fontSize="small"
          onClick={openMenu}
        />
        <Menus
          accessData={accessData}
          anchorEl={anchorEl}
          closeMenu={closeMenu}
          modifyTime={() => {
            closeMenu();
            dateInputRef.current.focus();
            dateInputRef.current.click();
          }}
          submit={submit}
          type="leadingDate"
        />
      </Box>
    );
  }
);

export default connect(
  (
    { auth, documentList, orders, orderActivities, templates },
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
      activityNumber,
      orderNumber,
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
)(LeadingDate);
