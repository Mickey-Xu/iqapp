import { Box, FormLabel, makeStyles, Typography } from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import ButtomGroup from "@material-ui/core/ButtonGroup";
import { disableForm } from "js/util";
import { useParams } from 'react-router-dom';
import React from "react";

const useStyles = makeStyles(({ spacing }) => ({
  box: {
    margin: spacing(1, 0, 2, 0),
    borderBottom: " 1px solid #e0e0e0",
    paddingBottom: spacing(1),
    textAlign: "right",
  },
  ButtomGroup: {
    textAlign: "right",
    margin: spacing(2, 0),
  },
  root: {
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  button: {
    textTransform: "none",
  },
  lable: {
    padding: spacing(0, 0, 1, 0),
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.87)",
  },
  description: {
    display: "block",
    textAlign: "left",
  },
  descriptionImg: {
    width: "50%",
  },
}));

export const NaYesNo = (props) => {
  const classes = useStyles();
  const params = useParams()

  return (
    <div className={classes.root}>
      <FormLabel required={props.required}>
        <Typography
          component="span"
          variant="subtitle2"
          className={classes.lable}
        >
          {props.label}
        </Typography>
      </FormLabel>
      {props.images.map((item, index) => {
        return (
          <div key={index} className={classes.descriptionImg}>
            <img src={item.url} width="100%" alt="" />;
          </div>
        );
      })}
      <Box className={classes.box}>
        <ButtomGroup size="small" className={classes.ButtomGroup}>
          {props.itemValues.map((v, i) => {
            const color = props.value === v ? { color: "primary" } : {};
            return (
              <Button
                key={i}
                variant="contained"
                className={`${classes.button}`}
                value={v}
                {...color}
                onClick={(event) => {
                  if (disableForm(params)) {
                    return false
                  }
                  props.onClick(event)
                }
                }
              >
                {props.itemTexts[i]}
              </Button>
            );
          })}
        </ButtomGroup>
        <Typography variant="body2" className={classes.lable}>
          {props.description}
        </Typography>
      </Box>
    </div>
  );
};
