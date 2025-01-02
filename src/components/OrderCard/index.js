import { Box, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import classnames from "classnames";
import InstallationMethod from "components/InstallationMethod";
import OrderProgress from "components/OrderProgress";
import SelectBale from "components/SelectBale";
import React from "react";
import { connect } from "react-redux";

const OrderCard = withStyles(({ palette }) => {
  return {
    root: {
      borderBottomColor: "black",
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
    },
    box: {
      backgroundColor: palette.grey["300"],
    },
    item: {
      display: "flex",
      alignItems: "center",
    },
  };
})(
  ({
    classes,
    installationMethod,
    isShowBackground,
    orderNumber,
    productFamily,
    selectBox,
  }) => {
    const column = installationMethod ? 6 : 8;
    return (
      <Box
        mx={-2}
        py={1}
        px={2}
        fontSize="caption.fontSize"
        className={classnames(classes.root, {
          [classes.box]: !isShowBackground,
        })}
      >
        <Grid container spacing={1}>
          {installationMethod && (
            <Grid className={classes.item} item xs={2}>
              <SelectBale
                selectBox={(event) => {
                  selectBox(event, orderNumber);
                }}
                number={orderNumber}
              />
            </Grid>
          )}
          <Grid className={classes.item} item xs={column}>
            {orderNumber}
          </Grid>
          <Grid className={classes.item} item xs={4}>
            <InstallationMethod orderNumber={orderNumber} />
          </Grid>
          {installationMethod && (
            <Grid className={classes.item} item xs={2}></Grid>
          )}
          <Grid className={classes.item} item xs={column}>
            {productFamily}
          </Grid>
          <Grid item xs={4}>
            <OrderProgress orderNumber={orderNumber} />
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default connect(
  ({ orders }, { isShowBackground, orderNumber }) => {
    const { productFamily } = orders[orderNumber] || {};

    return {
      isShowBackground,
      orderNumber,
      productFamily,
    };
  },
  (dispatch) => {
    return {
      selectBox: (event, number) => {
        dispatch(action.selectBale(number));
        event.stopPropagation();
      },
    };
  }
)(OrderCard);
