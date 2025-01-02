import { Box, List, ListItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import OrderCard from "components/OrderCard";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const ProjectOrderList = withStyles(({ spacing }) => {
  return {
    root: {
      width: "100%",
      display: "block",
      padding: spacing(0, 2),
    },
    box: {
      textAlign: "right",
      textTransform: "none",
      borderBottom: "1px solid",
    },
    button: {
      textTransform: "none",
    },
  };
})(
  ({
    classes,
    data,
    installationMethod,
    selectAll,
    unSelectAll,
    save,
    selectBale,
  }) => {
    const history = useHistory();
    return (
      <List>
        {installationMethod && (
          <Box className={classes.box}>
            <Button
              color="secondary"
              className={classes.button}
              onClick={() => selectAll(data)}
            >
              Select All
            </Button>
            <Button
              color="secondary"
              className={classes.button}
              onClick={unSelectAll}
            >
              Unselect All
            </Button>
            <Button
              color="primary"
              className={classes.button}
              disabled={selectBale.length < 1}
              onClick={save}
            >
              Save
            </Button>
          </Box>
        )}
        {data.map((number, index) => {
          return (
            <ListItem
              className={classes.root}
              key={index}
              onClick={() => {
                history.push(`/order/${number}`);
              }}
            >
              <OrderCard
                installationMethod={installationMethod}
                isShowBackground={true}
                orderNumber={number}
              />
            </ListItem>
          );
        })}
      </List>
    );
  }
);

export default connect(
  ({ orders, selectBale }, { installationMethod, searchCriteria }) => {
    return {
      data: !searchCriteria
        ? Object.keys(orders)
        : Object.keys(orders).filter((key) => {
            return (
              orders[key].number
                .toLowerCase()
                .indexOf(searchCriteria.toLowerCase()) > -1 ||
              orders[key].productFamily
                .toLowerCase()
                .indexOf(searchCriteria.toLowerCase()) > -1
            );
          }),
      installationMethod,
      selectBale,
    };
  },
  (dispatch) => {
    return {
      save: () => {},
      selectAll: (number) => {
        dispatch(action.selectAll(number));
      },
      unSelectAll: () => {
        dispatch(action.unSelectAll());
      },
    };
  }
)(ProjectOrderList);
