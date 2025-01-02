import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Alert from "components/Alert";
import Loading from "components/Loading";
import React, { Fragment, useEffect } from "react";

const TitleBar = withStyles(({ spacing }) => {
  return {
    toolbar: {
      minHeight: spacing(6.5),
    },
    title: {
      textAlign: "center",
      flex: 1,
    },
  };
})(({ classes, title }) => {
  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Typography variant="subtitle1" className={classes.title}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
});

const SecondaryLayout = withStyles(({ spacing }) => {
  return {
    main: {
      position: "fixed",
      top: spacing(6.5),
      left: 0,
      right: 0,
      bottom: 0,
      padding: spacing(0, 2),
      overflowY: "scroll",
    },
  };
})(({ classes, children, title }) => {
  useEffect(() => {
    document.title = `SCF Installation Quality - ${title}`;
  }, [title]);

  return (
    <Fragment>
      <TitleBar title={title} />
      <main className={classes.main}>{children}</main>
      <Loading />
      <Alert />
    </Fragment>
  );
});

export default SecondaryLayout;
