import {
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import React, { useEffect } from "react";
import { connect } from "react-redux";

const OrderInfo = withStyles(({ spacing }) => {
  return {
    box: {
      padding: spacing(1.25),
    },
    progress: {
      backgroundColor: "red",
      padding: spacing(0, 0.5),
    },
    label: {
      paddingLeft: spacing(1.25),
      color: "#747474",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    icon: {
      paddingLeft: spacing(1.25),
      paddingTop: spacing(0.65),
    },
    btn: {
      paddingLeft: spacing(1),
    },
    navIcon: {
      display: "flex",
      alignItems: "center",
    },
    select: {
      display: "flex",
    },
    content: {
      display: "flex",
    },
  };
})(({ classes, fields, data, updateOrderInstallationsMethod, auth }) => {
  const [currency, setCurrency] = React.useState();

  useEffect(() => {
    setCurrency(data?.defaultselectValue?.toString());
  }, [data]);

  const handleSubmit = (event) => {
    setCurrency(event.target.value);
    updateOrderInstallationsMethod({
      orderNumbers: [data.orderNumber],
      installationMethod: event.target.value,
    });
  };

  return (
    <div>
      {fields.map((item, index) => {
        return (
          <div key={index}>
            <Grid container alignItems="center" className={classes.box}>
              <Grid item className={classes.icon}>
                {<item.icon />}
              </Grid>
              <Grid item xs className={classes.label}>
                <Typography variant="body2" style={{ width: "40%" }}>
                  {item.label}
                </Typography>
                {item.name === "installMethod" ? (
                  <FormControl disabled={auth.roles[0] !== "PE"}>
                    <Select value={currency || ""} onChange={handleSubmit}>
                      {data.installMethods?.map((item, index) => {
                        return (
                          <MenuItem value={item.value} key={index}>
                            <Typography
                              variant="body2"
                              align="center"
                              color="textSecondary"
                            >
                              {item.label}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body2" component="span" align="right">
                    {item.component !== undefined ? (
                      <item.component />
                    ) : (
                      <span>{data[item.name]}</span>
                    )}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Divider />
          </div>
        );
      })}
    </div>
  );
});

const mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOrderInstallationsMethod: (data) => {
      dispatch(action.updateOrderInstallationsMethod(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderInfo);
