import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  lable: {
    color: "rgba(0, 0, 0, 0.87)",
  },
}));

export const Checkboxes = (props) => {
  const classes = useStyles();
  const params = useParams()

  return (
    <div className={classes.root}>
      <FormControl component="fieldset">
        <FormLabel component="legend" required={props.required}>
          <Typography
            component="span"
            variant="subtitle2"
            className={classes.lable}
          >
            {props.label}
          </Typography>
        </FormLabel>
        <FormGroup>
          {props.options.map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    disabled={disableForm(params)}
                    checked={props.value.some((propsChecked) => {
                      return propsChecked === item.value;
                    })}
                    onChange={() => props.onChange(item.value)}
                    id={item.id}
                    value={item.value}
                  />
                }
                label={item.nameI18n.English}
              />
            );
          })}
        </FormGroup>
        <FormHelperText>{props.descriptionI18n}</FormHelperText>
      </FormControl>
    </div>
  );
};
