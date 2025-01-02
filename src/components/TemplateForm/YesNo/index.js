import {
  Box,
  FormControlLabel,
  makeStyles,
  Typography,
} from "@material-ui/core/";
import Switch from "@material-ui/core/Switch";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    borderBottom: " 1px solid #e0e0e0",
  },
  lable: {
    width: "100%",
    margin: 0,
  },
}));

export const YesNo = (props) => {
  const classes = useStyles();
  const params = useParams()

  return (
    <Box className={classes.box}>
      <Typography variant="subtitle2" style={{ margin: "8px 0" }}>
        {props.label}
      </Typography>
      <FormControlLabel
        className={classes.lable}
        control={
          <Switch
            color="primary"
            checked={props.value}
            onChange={(event)=>
            {
              if (disableForm(params)) {
                return false
              }
              props.onChange(event)
              }
            }
          />
        }
        labelPlacement="start"
      />
    </Box>
  );
};
