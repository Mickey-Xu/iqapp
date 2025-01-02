import {
  FormLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles(() => ({
  lable: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "1.2rem",
  },
}));

export const Paragraph = (props) => {
  const classes = useStyles();
  const params = useParams()

  return (
    <TextField
      fullWidth
      id={props.id}
      onChange={props.onChange}
      disabled={disableForm(params)}
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
      value={props.value}
      helperText={props.helperText}
      multiline
      rows={4}
    />
  );
};
