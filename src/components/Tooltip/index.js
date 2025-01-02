import { Tooltip, withStyles } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";

const Message = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "transparent",
    color: "red",
    fontSize: theme.typography.pxToRem(12),
    margin: "0",
    padding: "0",
  },
}))(Tooltip);

const Tooltips = ({ message }) => {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <Message
      onClose={handleTooltipClose}
      open={open}
      title={message}
      placement="bottom-end"
    >
      <InfoIcon onClick={handleTooltipOpen} color="error" />
    </Message>
  );
};

export default Tooltips;
