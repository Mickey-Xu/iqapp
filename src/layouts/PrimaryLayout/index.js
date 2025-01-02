import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  ArrowBackIos,
  AssignmentOutlined,
  Refresh,
  Schedule,
} from "@material-ui/icons";
import * as action from "actions";
import fitter2 from "assets/svg/fitter2.svg";
import fitter3 from "assets/svg/fitter3.svg";
import Alert from "components/Alert";
import Loading from "components/Loading";
import { LocalizeContext } from "i18n";
import projectIcon from "img/project.png";
import SelectedProjectIcon from "img/selectedProject.png";
import { db } from "js/db";
import * as repo from "js/fetch";
import { getAwaitComplateAwaitCloseCount } from "js/util";
import { recordRefreshTime } from "js/util";
import React, { Fragment, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(action.logout());
    },
    refresh: () => {
      dispatch(action.fetchAll());
    },
    getData: () => {
      dispatch(action.fetchAll(repo.type.CACHE));
    },
    getLanguage: () => {
      db.cache.get("settings").then((cache) => {
        if (!cache) {
          return;
        }
        const {
          language: { language },
        } = cache.data;
        dispatch(action.setLanguage(language));
      });
    },
    getRefreshData: () => {
      recordRefreshTime(dispatch);
    },
    setScrollPosition: (data) => {
      dispatch(action.setScrollPosition(data));
    },
    backPage: (history, name, root) => {
      if (name === "activity Document") {
        dispatch(action.setOrderDetailPageDefaultTab(root));
        history.goBack();
      } else {
        history.goBack();
      }
    },
  };
};

const mapStateToProps = (state) => {
  let tasks = Object.keys(state?.tasks).length > 0 ? state?.tasks : [];
  var taskSum = 0;
  const taskList = getAwaitComplateAwaitCloseCount(tasks);
  const duplicateRemovalTasks = taskList.filter((task, index, self) =>
    index === self.findIndex(t => t.taskType === task.taskType)
  );
  duplicateRemovalTasks.forEach((item) => {
    taskSum += (item.awaitStartNum + item.awaitComplateNum + item.awaitCloseNum)
  })

  return { taskSum };
};

const TitleBar = withStyles(({ spacing }) => {
  return {
    appBar: {
      borderBottomColor: "#e0e0e0",
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
    },
    toolbar: {
      minHeight: spacing(6.5),
      backgroundColor: "rgb(255,255,255)",
      color: "black",
    },
    icon: {
      minWidth: spacing(5),
    },
    title1: {
      textAlign: "left",
      flex: 1,
      fontFamily: "'微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑'",
      fontSize: 18,
    },
    title2: {
      textAlign: "center",
      flex: 1,
      fontFamily: "'微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑'",
      fontSize: "18px",
    },
  };
})(
  connect(
    null,
    mapDispatchToProps
  )(
    ({
      classes,
      refresh,
      title,
      pageLevel,
      isShowRefreshButton = false,
      goBack,
    }) => {
      return (
        <AppBar elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            {pageLevel !== 1 && (
              <ArrowBackIos
                aria-label="back"
                fontSize="small"
                onClick={() => {
                  goBack();
                }}
              />
            )}
            <Typography
              variant="subtitle1"
              className={pageLevel === 1 ? classes.title1 : classes.title2}
            >
              {title}
            </Typography>
            {isShowRefreshButton && (
              <Refresh fontSize="small" onClick={() => refresh()} />
            )}
          </Toolbar>
        </AppBar>
      );
    }
  )
);

const BottomBar = withStyles(({ spacing }) => {
  return {
    root: {
      position: "fixed",
      bottom: 0,
      width: "100%",
      height: window.screen.height >= "812" ? spacing(10) : spacing(9),
    },
    content: {
      padding: 0,
      "&$selected": {
        paddingTop: 0,
      },
      minWidth: "unset",
    },
    selected: {},
    project: {
      marginBottom: spacing(0.4),
      transform: "scaleX(-1)",
    },
  };
})(({ classes, selected, taskSum }) => {
  const i18n = React.useContext(LocalizeContext);
  const auth = JSON.parse(window.localStorage.getItem("auth"));
  let roles = auth?.roles;
  const isEISV = roles.indexOf('SL') > -1;

  return (
    <div>
      <BottomNavigation value={selected} showLabels className={classes.root}>
        <BottomNavigationAction
          style={{ display: isEISV ?'none':''}}
          classes={{
            root: classes.content,
            selected: classes.selected,
          }}
          icon={<Schedule style={{ height: "22" }} />}
          component={Link}
          label={i18n.JOBLIST_ACTIVITY}
          to="/"
          value="activities"
        />
        <BottomNavigationAction
          style={{ display: isEISV ? 'none' : '' }}
          classes={{
            root: classes.content,
            selected: classes.selected,
          }}
          component={Link}
          icon={
            <img
              src={selected === "projects" ? SelectedProjectIcon : projectIcon}
              height="20"
              className={classes.project}
              alt=""
            />
          }
          to="/projects"
          label={i18n.INSTAPP_PROJECTLIST_PROJECT}
          value="projects"
        />
        <BottomNavigationAction
          classes={{
            root: classes.content,
            selected: classes.selected,
          }}
          component={Link}
          icon={<AssignmentOutlined />}
          label={i18n.INSTAPP_JOBLIST_TASKS}
          to="/TasksGroupPage"
          value="TasksGroupPage"
        />
        <BottomNavigationAction
          classes={{
            root: classes.content,
            selected: classes.selected,
          }}
          component={Link}
          icon={
            <img
              src={selected === "me" ? fitter2 : fitter3}
              width="26"
              alt=""
            />
          }
          label={i18n.INSTAPP_JOBLIST_ME}
          to="/me"
          value="me"
        />
      </BottomNavigation>
      <Hint taskSum={taskSum} isEISV={isEISV} />
    </div>
  );
});

const Hint = withStyles(({ spacing }) => {
  return {
    taskCount: {
      position: "fixed",
      bottom: spacing(5),
      backgroundColor: "red",
      borderRadius: "30px",
      color: "white",
      width: "24px",
      height: "24px",
      textAlign: "center",
      lineHeight: spacing(3) + "px",
    },
  };
})(({ classes, taskSum, isEISV }) => {
  const history = useHistory();

  return (
    <div>
      {taskSum > 0 && (
        <span
          className={classes.taskCount}
          style={isEISV ? {right:'64%'}: {right:'30%'}}
          onClick={() => history.push("/TasksGroupPage")}
        >
          {taskSum}
        </span>
      )}
    </div>
  );
});

const PrimaryLayout = withStyles(({ spacing }) => {
  return {
    main: {
      position: "fixed",
      top: spacing(6.5),
      left: 0,
      right: 0,
      bottom: window.screen.height >= "812" ? spacing(10) : spacing(9),
      overflowY: "scroll",
    },
  };
})(
  ({
    classes,
    children,
    name,
    getData,
    getLanguage,
    getRefreshData,
    title,
    pageLevel,
    isShowRefreshButton,
    isDirectReturn = true,
    goBack,
    isFetchAll = true,
    backPage,
    setScrollPosition,
    root,
    taskSum,
  }) => {
    const history = useHistory();

    const location = useLocation();

    const mainRef = useRef(null);

    let scrollPos = 0;
    useEffect(() => {
      repo.initDB();

      getLanguage();
      document.title = `安装质量管理App`;
      isFetchAll && getData();
      getRefreshData();
    }, [getLanguage, title, getData, getRefreshData, isFetchAll]);

    const scrollEvent = (e) => {
      scrollPos = e.target.scrollTop;
      setScrollPosition({ namepath: location.pathname, position: scrollPos });
    };
    return (
      <Fragment>
        <TitleBar
          title={title}
          pageLevel={pageLevel}
          isShowRefreshButton={isShowRefreshButton}
          goBack={() =>
            isDirectReturn ? backPage(history, name, root) : goBack()
          }
        />
        <main className={classes.main} onScroll={scrollEvent} ref={mainRef}>
          {children}
        </main>
        <BottomBar selected={name} taskSum={taskSum} />
        <Loading />
        <Alert />
      </Fragment>
    );
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
