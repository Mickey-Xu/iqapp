import {
  Box,
  FormLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const setDisabled = (identifier) => {
  const identifierArr = [
    "orderno",
    "liftno",
    "projectname",
    "instcustname",
    "instbranch",
    "pl",
    "pe",
    "subconcompany",
    "tl",
    "CurrentDate",
    "LoginUserName"
  ];
  return identifierArr.indexOf(identifier) > -1 ? true : false;
};

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    padding: spacing(2, 0, 1, 0),
    // borderBottom: " 1px solid #e0e0e0",
    marginBottom: spacing(2),
  },
  lable: {
    color: "rgba(0, 0, 0, 0.87)",
  },
}));

export const SingleLine = (props) => {
  const classes = useStyles();
  const params = useParams()


  return (
    <Box className={classes.box}>
      <FormLabel required={props.required}>
        <Typography
          component="span"
          variant="subtitle2"
          className={classes.lable}
        >
          {props.label}
        </Typography>
      </FormLabel>
      <TextField
        className={classes.TextField}
        fullWidth
        required={props.required}
        id={props.id}
        onChange={props.onChange}
        value={props.value}
        helperText={props.helperText}
        disabled={disableForm(params) ? disableForm(params) :  setDisabled(props.identifier)}
      />
    </Box>
  );
};
