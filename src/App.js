import MomentUtils from "@date-io/moment";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import PrivateRoute from "components/PrivateRoute";
import { createBrowserHistory } from "history";
import { LocalizeContext, localizedStrings } from "i18n";
import moment from "moment";
import "moment/locale/zh-cn";
import AboutPage from "pages/AboutPage";
import ActivityDetailPage from "pages/ActivityDetailPage";
import ActivityListPage from "pages/ActivityListPage";
import ChangePasswordPage from "pages/ChangePasswordPage";
import DocumentsPage from "pages/DocumentsPage";
import FittersAssignmentPage from "pages/FittersAssignmentPage";
import LoginPage from "pages/LoginPage";
import MePage from "pages/MePage";
import NewUserResetPasswordPage from "pages/NewUserResetPasswordPage";
import OrderActivityListPage from "pages/OrderActivityListPage";
import OrderDetailPage from "pages/OrderDetailPage";
import OrderInstallationListPage from "pages/OrderInstallationListPage";
import ProjectDetailPage from "pages/ProjectDetailPage";
import ProjectInstallationStepsPage from "pages/ProjectInstallationStepsPage";
import ProjectListPage from "pages/ProjectListPage";
import ProjectProgressPage from "pages/ProjectProgressPage";
import SubconTeamPage from "pages/SubconTeamPage";
import SynchronizePage from "pages/SynchronizePage";
import TaskCreatePage from "pages/TaskCreatePage";
import TaskManagermentPage from "pages/TaskManagermentPage";
import TasksPage from "pages/TasksPage";
import TasksGroupPage from "pages/TaskGroupPage";
import TemplatePage from "pages/TemplatePage";
import UserManualPage from "pages/UserManualPage";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import TaskListPage from "pages/TaskListPage";

const history = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    // primary: {
    //   main: "#dc0000",
    // },
  },
});

const App = ({ settings }) => {
  const auth = JSON.parse(window.localStorage.getItem("auth"));
  let roles = auth?.roles||[];
  const isEISV = roles.indexOf('SL') > -1;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.REACT_APP_BAIDU_MAP_CDN + process.env.REACT_APP_BAIDU_MAP_AK + '&callback=initMap'; 
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); 
    };
  }, []);

  
  return (
    <Fragment>
      <CssBaseline />
      <LocalizeContext.Provider value={localizedStrings[settings.language]}>
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={settings.language}
        >
          <ThemeProvider theme={theme}>
            <Router history={history}>
              <Switch>
                <PrivateRoute exact path="/" component={!isEISV ? ActivityListPage : TasksGroupPage} />
                <PrivateRoute
                  path="/activity/:number"
                  component={ActivityDetailPage}
                />
                <PrivateRoute
                  path="/documents/:activityNo/:orderNo/:productFamily/:root"
                  component={DocumentsPage}
                />
                <Route path="/login" component={LoginPage} />
                <PrivateRoute
                  path="/fitters/:number"
                  component={FittersAssignmentPage}
                />
                <Route
                  path="/orderInstallations/:number"
                  component={OrderInstallationListPage}
                />
                <PrivateRoute
                  path="/orderActivities/:number"
                  component={OrderActivityListPage}
                />
                <PrivateRoute
                  path="/template/:documentNo/:documentPart/:activityNo/:orderNo/:projectNumber/:productFamily/:productLine/:language"
                  component={TemplatePage}
                />
                <PrivateRoute
                  path="/order/:number"
                  component={OrderDetailPage}
                />
                <PrivateRoute path="/projects" component={ProjectListPage} />
                <PrivateRoute path="/subconTeam" component={SubconTeamPage} />
                <PrivateRoute path="/tasks/:type" component={TasksPage} />
                <PrivateRoute path="/me" component={MePage} />
                <PrivateRoute path="/about" component={AboutPage} />
                <PrivateRoute path="/synchronize" component={SynchronizePage} />
                <PrivateRoute path="/userManual" component={UserManualPage} />
                <PrivateRoute
                  path="/ChangePassword"
                  component={ChangePasswordPage}
                />
                <PrivateRoute
                  path="/newUserResetPassword/:firstLogin/:firstLoginPassword"
                  component={NewUserResetPasswordPage}
                />
                <PrivateRoute
                  path="/taskManagerment"
                  component={TaskManagermentPage}
                />
                <PrivateRoute
                  path="/TasksGroupPage"
                  component={TasksGroupPage}
                />
                <PrivateRoute path="/taskcreate" component={TaskCreatePage} />
                <PrivateRoute
                  path="/projectProgressPage/:projectNumber"
                  component={ProjectProgressPage}
                />
                <PrivateRoute
                  path="/projectInstallationSteps/:projectNumber"
                  component={ProjectInstallationStepsPage}
                />
                <PrivateRoute
                  path="/project/:projectNumber"
                  component={ProjectDetailPage}
                />
                <PrivateRoute
                  path="/taskList/:type"
                  component={TaskListPage}
                />
                <Redirect from="/" to="/" />
              </Switch>
            </Router>
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </LocalizeContext.Provider>
    </Fragment>
  );
};

const mapStateToProps = ({ settings }) => {
  return {
    settings,
  };
};

export default connect(mapStateToProps)(App);
