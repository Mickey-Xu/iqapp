import {
  FormLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles((theme) => ({
  lable: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: " 1.2rem",
  },
  textField: {
    margin: theme.spacing(1, 0),
  },
}));
export const DateTime = (props) => {
  const classes = useStyles();
  const params = useParams()

  return (
    <TextField
      disabled={disableForm(params)}
      fullWidth
      id={props.id}
      label={
        <FormLabel required={props.required}>
          <Typography
            component="span"
            variant="subtitle2"
            className={classes.lable}
          >
            {props.label}
          </Typography>
        </FormLabel>
      }
      type={props.includeTime ? `datetime-local` : `date`}
      value={props.value || ""}
      className={classes.textField}
      onChange={props.onChange}
    />
  );
};
