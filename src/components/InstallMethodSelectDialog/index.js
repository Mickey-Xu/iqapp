import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";

const options = [
  ["scaffold", "有脚手架安装-Scaffold"],
  ["scaffoldless", "MX无脚手架安装-Scaffoldless"],
  ["tirak", "Tirck"],
  ["escalator", "扶梯安装-Escalator"],
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: theme.spacing(1),
  },
  paper: {
    width: "80%",
    maxHeight: 435,
  },
  button: {
    flex: "auto",
    fontSize: "0.75rem",
    textTransform: "none",
  },
  font: {
    fontSize: "0.75rem",
  },
  h2: {
    "& h2": {
      fontSize: "1rem",
    },
  },
}));

function ConfirmationDialogRaw(props) {
  const classes = useStyles();
  const { onClose, open, title, handleClick, ...other } = props;
  const [units, setUnits] = React.useState("");
  const [selectInstMethod, setSelectInstMethod] = React.useState("");

  React.useEffect(() => {
    setSelectInstMethod("");
    if (!open) {
      setUnits("");
    }
  }, [open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose();
    handleClick(units);
  };

  const handleChange = (event) => {
    setUnits(event.target.value);
    setSelectInstMethod(event.target.value);
  };

  return (
    <Dialog onClose={onClose} open={open} {...other}>
      <DialogTitle className={classes.h2}>{title}</DialogTitle>
      <DialogContent dividers>
        <RadioGroup value={units} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel
              value={option[0]}
              key={option}
              control={<Radio size={"small"} />}
              label={option[1]}
              classes={{ label: classes.font }}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          className={classes.button}
          onClick={handleCancel}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          onClick={handleOk}
          disabled={selectInstMethod ? false : true}
          color="primary"
        >
          Select Units
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ConfirmationDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const { handleClick } = props;

  const handleClickUpdateType = (value) => {
    setTitle(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Button className={classes.button}>Group</Button>
      <Button className={classes.button}>Progress</Button>
      <Button
        className={classes.button}
        onClick={() => {
          handleClickUpdateType("Inst. Method");
        }}
      >
        Inst. Method
      </Button>
      <Button className={classes.button}>Fitter assignment</Button>
      <ConfirmationDialogRaw
        classes={{
          paper: classes.paper,
        }}
        open={open}
        onClose={handleClose}
        title={title}
        handleClick={handleClick}
      />
    </div>
  );
}
