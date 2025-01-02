import { Box } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";

const CuurrentUser = ({ currentUser }) => {
  return <Box>{currentUser}</Box>;
};

export default connect(({ auth }) => {
  return {
    currentUser: `${auth.surname} ${auth.name}`,
  };
})(CuurrentUser);
