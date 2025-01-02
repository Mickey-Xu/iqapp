import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      render={(props) => {
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: props.location.pathname,
            }}
          />
        );
      }}
      {...rest}
    />
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    isAuthenticated: !!auth,
  };
};

export default connect(mapStateToProps)(PrivateRoute);
