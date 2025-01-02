import {
  Box,
  FormHelperText,
  FormLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";
const useStyles = makeStyles(({ spacing }) => ({
  box: {
    borderTop: " 1px solid #e0e0e0",
    borderBottom: " 1px solid #e0e0e0",
    margin: spacing(1, 0),
    paddingTop: spacing(1),
  },
  lable: {
    color: "rgba(0, 0, 0, 0.87)",
  },
}));

export const SingleChoice = (props) => {
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
      <RadioGroup
        aria-label={props.label}
        value={props.value}
        onChange={props.onChange}
       
      >
        {props.options.map((item, index) => {
          return (
            <FormControlLabel
              key={index}
              value={item.value}
              control={<Radio disabled={disableForm(params)} />}
              label={
                item.nameI18n.Chinese
                  ? item.nameI18n.Chinese
                  : item.nameI18n.English
              }
              id={item.id}
            />
          );
        })}
      </RadioGroup>
      <FormHelperText>{props.helperText}</FormHelperText>
    </Box>
  );
};
