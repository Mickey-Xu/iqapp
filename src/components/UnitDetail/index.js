import { Box, FormControl, FormLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React from "react";
import { useHistory } from "react-router-dom";
import Steps from "../../assets/img/nodeStatus.png";
import OverView from "../../assets/img/over_view.png";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "0.75rem",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  box: {
    borderBottomColor: theme.palette.grey["400"],
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    marginTop: theme.spacing(1),
  },
  icon: {
    fontSize: "0.875rem",
  },
  steps: {
    width: "22px",
    marginRight: theme.spacing(1),
  },
  overView: {
    height: "20px",
    marginRight: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(0, 0, 1, -1.5),
    color: " #3acad1",
    fontWeight: 600,
  },
}));

const UnitDetail = (props) => {
  const classes = useStyles();

  const history = useHistory();

  const { data, fields } = props;
  return (
    <FormControl fullWidth className={classes.form}>
      {fields.map((item, key) => {
        const Component = item.component;

        return (
          <Box className={classes.box} key={key}>
            {item.to !== undefined ? (
              <Box
                style={{ display: "flex", alignItems: "center" }}
                mb={1.75}
                mt={0.75}
                onClick={() => history.push(item.to)}
              >
                <img
                  src={item.description === "ACTIVITY" ? Steps : OverView}
                  className={
                    item.description === "ACTIVITY"
                      ? classes.overView
                      : classes.steps
                  }
                  alt=""
                />
                <Box fontSize="body2.fontSize" style={{ flex: "auto" }}>
                  {item.label}
                </Box>
                <ArrowForwardIosIcon classes={{ root: classes.icon }} />
              </Box>
            ) : (
              <Box style={{ display: "flex" }}>
                <Box style={{ flex: "auto" }}>
                  <FormLabel
                    component="legend"
                    classes={{ root: classes.root }}
                  >
                    {item.title && (
                      <Box className={classes.title}>{item.title}</Box>
                    )}
                    {item.label}
                  </FormLabel>
                  <Box fontSize="body2.fontSize" mb={0.5} mt={0.5}>
                    <Box
                      onClick={
                        item.muito ? () => history.push(item.muito) : () => {}
                      }
                      style={{ minHeight: "20px" }}
                    >
                      {item.component !== undefined ? (
                        <Component></Component>
                      ) : (
                        data[item.name]
                      )}
                    </Box>
                  </Box>
                </Box>
                {item.muito !== undefined && (
                  <Box mb={0.5} style={{ alignSelf: "center" }}>
                    <ArrowForwardIosIcon
                      classes={{ root: classes.icon }}
                      onClick={() => history.push(item.muito)}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </FormControl>
  );
};

export default UnitDetail;
