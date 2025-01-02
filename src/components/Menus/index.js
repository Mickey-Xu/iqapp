import { ListItemIcon, Menu, MenuItem, Typography } from "@material-ui/core";
import AccessAlarmSharpIcon from "@material-ui/icons/AccessAlarmSharp";
import CancelScheduleSendSharpIcon from "@material-ui/icons/CancelScheduleSendSharp";
import React from "react";
import { LocalizeContext } from "i18n";
const Menus = ({
  accessData,
  anchorEl,
  closeMenu,
  submit,
  modifyTime,
  type,
}) => {
  const i18n = React.useContext(LocalizeContext);

  return (
    <Menu anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={closeMenu}>
      {Object.keys(accessData).map((Item, index) => {
        if (type === "leadingDate") {
          if (Item === "unLock") {
            return (
              <MenuItem
                key={index}
                disabled={!accessData[Item]}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure to ${
                        type === "leadingDate"
                          ? "cancel the planned"
                          : "unlock the leading"
                      } date?`
                    )
                  )
                    submit(null);
                }}
              >
                <ListItemIcon>
                  <CancelScheduleSendSharpIcon />
                </ListItemIcon>
                <Typography variant="inherit">
                  {i18n.ORDERDETAILS_UNLOCK}
                </Typography>
              </MenuItem>
            );
          } else if (Item === "Lock") {
            return (
              <MenuItem
                key={index}
                disabled={!accessData[Item]}
                onClick={() => modifyTime()}
              >
                <ListItemIcon>
                  <AccessAlarmSharpIcon />
                </ListItemIcon>
                <Typography variant="inherit">
                  {i18n.ORDERDETAILS_LOCK}
                </Typography>
              </MenuItem>
            );
          }
        } else {
          if (Item === "Cancel") {
            return (
              <MenuItem
                key={index}
                disabled={!accessData[Item]}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure to ${
                        type === "leadingDate"
                          ? "cancel the planned"
                          : "unlock the leading"
                      } date?`
                    )
                  )
                    submit(null);
                }}
              >
                <ListItemIcon>
                  <CancelScheduleSendSharpIcon />
                </ListItemIcon>
                <Typography variant="inherit">{i18n.GENERAL_CANCEL}</Typography>
              </MenuItem>
            );
          } else if (Item === "Confirm") {
            return (
              <MenuItem
                key={index}
                disabled={!accessData[Item]}
                onClick={() => modifyTime()}
              >
                <ListItemIcon>
                  <AccessAlarmSharpIcon />
                </ListItemIcon>
                <Typography variant="inherit">
                  {i18n.GENERAL_CONFIRM}
                </Typography>
              </MenuItem>
            );
          }
        }
        return <div key={index}></div>;
      })}
    </Menu>
  );
};

export default Menus;
