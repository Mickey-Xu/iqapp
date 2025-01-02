import { FormLabel, makeStyles, Typography } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import { disableForm } from "js/util";
import { showNumberText } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  lable: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: " 1rem",
  },
  textField: {
    margin: spacing(1, 0),
  },
}));

export const NumberText = (props) => {
  const classes = useStyles();
  const maxMin = showNumberText(props.min, props.max);
  const params = useParams()

  const description = props.helperText ? props.helperText + maxMin : maxMin;

  const onBlur = (value) => {
    if (props.min || props.max) {
      if (value < props.min || value > props.max) {
        alert(`${props?.label}: ${description}`);
      }
    }
  }
  
  return (
    <TextField
      onBlur={(event) => onBlur(event.target.value)}
      value={props.value}
      onChange={(event) => props.onChange(event, props)}
      fullWidth
      type={props.type}
      disabled={disableForm(params) ? disableForm(params): props?.prefilledAnswer=== "%%!LoginUserNo!%%"}
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
      id={props.id}
      className={clsx(classes.margin, classes.textField)}
      InputProps={
        props.unitFront
          ? {
              startAdornment: <InputAdornment>{props.unit}</InputAdornment>,
            }
          : {
              endAdornment: <InputAdornment>{props.unit}</InputAdornment>,
            }
      }
      helperText={description}
    />
  );
};
// props.helperText
