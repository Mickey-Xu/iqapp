import { Box, Button, makeStyles, Typography, TextField } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Loading from "assets/img/loading.gif";
import Refresh from "assets/img/refresh.png";
import { LocalizeContext } from "i18n";
import { recordRefreshTime, updateOrdersData } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useState } from "react";
import { connect } from "react-redux";
import ConfirmModal from "components/ConfirmModal";
import AddIcon from '@material-ui/icons/Add';
import { showUploadButton } from "js/util";
const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: "100%",
    // color: "#7e7a7a",
    fontWeight: "500",
    marginBottom: spacing(2),
  },
  box: {
    width: "90%",
    margin: spacing(2, "auto", 0),
    marginTop: spacing(2),
  },
  list: {
    padding: 0,
    backgroundColor: "#fff",
  },
  secondList: {
    padding: 0,
    backgroundColor: "#fff",
    paddingLeft: spacing(2),
  },
  title: {
    padding: "0px 35px 0 16px",
    marginTop: spacing(2),
    backgroundColor: "#fff",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItem: {
    backgroundColor: "#fff",
    paddingBottom: spacing(1),
    position: "relative",
  },
  listItemText: {
    padding: 0,
  },

  loadItem: {
    fontSize: "12px",
  },
  loading: {
    width: spacing(2),
    position: "absolute",
    right: spacing(1),
  },
  refreshTime: {
    marginLeft: spacing(2),
  },
  fail: {
    color: "red",
  },
}));

const SynchronizePage = ({
  refresh,
  refreshTime,
  projects,
  requestStatus: {
    documentStatus,
    masterDataStatus,
    ordersDataStatus,
    templateListStatus,
    taskListStatus,
  },
  auth,
  updateOrdersData
}) => {
  const i18n = React.useContext(LocalizeContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [SODialog, setSODialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [SONO, setSONO] = useState({ pNumber: auth.personalNumber });
  const [moduleName, setModuleName] = useState({});

  const status = [
    documentStatus,
    masterDataStatus,
    ordersDataStatus,
    templateListStatus,
    taskListStatus,
  ];
  const data = [
    {
      label: i18n.ISNTAPP_SYNCHRONIZE_ORDER,
      value: "orders",
      list: [
        {
          label: i18n.ISNTAPP_SYNCHRONIZE_MASTER_DATA,
          date: refreshTime.masterDataRefreshTime,
          loading: masterDataStatus,
        },
        {
          label: i18n.ISNTAPP_SYNCHRONIZE_ORDER_DATA,
          date: refreshTime.orderDataRefreshTime,
          loading: ordersDataStatus,
        },
      ],
    },
    {
      label: i18n.ISNTAPP_SYNCHRONIZE_DOCUMENTS,
      value: "documents",
      list: [
        {
          label: i18n.ISNTAPP_SYNCHRONIZE_DOCUMENTS,
          date: refreshTime.templateListDataRefreshTime,
          loading: templateListStatus,
        },
        {
          label: i18n.ISNTAPP_SYNCHRONIZE_DOCUMENT_LIST,
          date: refreshTime.documentListDataRefreshTime,
          loading: documentStatus,
        },
      ],
    },
    {
      label: i18n.ISNTAPP_SYNCHRONIZE_TASK,
      value: "task",
      list: [
        {
          label: i18n.ISNTAPP_SYNCHRONIZE_TASK_LIST,
          date: refreshTime.taskListDataRefreshTime,
          loading: taskListStatus,
        },
      ],
    },
  ];

  const synchroData = (name, projects) => {
    // if (auth?.roles[0] === "SL") {
    //     setOpen(true)
    // } else {
      refresh(name, projects, userInfo)
    // }
  }

  const confirmRefresh = () => {
    if (!userInfo?.pNumber) {
      return false;
    }
    window.localStorage.setItem("peInfo", JSON.stringify({ pNumber: userInfo?.pNumber }));
    refresh(moduleName.name, moduleName.projects, userInfo)
    setOpen(false)
  }

  const confirmSO = () => {
    setSODialog(false);
    updateOrdersData(SONO);
    setSONO(null);
  }

  return (
    <PrimaryLayout
      name="synchronize"
      title={i18n.ISNTAPP_SYNC_PAGE}
      isShowRefreshButton={false}
      isFetchAll={false}
    >
      <Box className={classes.root}>
        <Box className={classes.title}>
          <Typography variant="h6">{i18n.ISNTAPP_SYNCHRONIZE_PAGE}</Typography>
          <Box>
            {showUploadButton() &&
              <Button
                onClick={() => setSODialog(true)}
              >
                <AddIcon color="error" />
              </Button>
            }
            <Button
              onClick={() => {
                synchroData("all", projects);
                setModuleName({ name: "all", projects: projects })
              }}
              disabled={status.indexOf("loading") > -1 ? true : false}
            >
              <img src={Refresh} width="32" alt="" />
            </Button>
          </Box>
        </Box>

        {data.map((item, index) => {
          return (
            <Box key={index} className={classes.box}>
              <List className={classes.list}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2">{item.label}</Typography>
                    }
                  />
                  <Button
                    onClick={() => {
                      synchroData(item.value, projects);
                      setModuleName({ name: item.value, projects: projects })
                    }}
                    disabled={status.indexOf("loading") > -1 ? true : false}
                  >
                    <img src={Refresh} width="32" alt="" />
                  </Button>
                </ListItem>
              </List>
              <Divider />
              <List className={classes.secondList}>
                {item.list.map((item, index) => {
                  return (
                    <Box key={index}>
                      <ListItem className={classes.listItem}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {item.label}
                            </Typography>
                          }
                        />
                        <ListItemText
                          primary={
                            <Typography
                              className={classes.loadItem}
                              color="textSecondary"
                            >
                              <span
                                className={
                                  item.loading === "failToLoad"
                                    ? classes.fail
                                    : ""
                                }
                              >
                                {item.loading === "loading"
                                  ? i18n.ISNTAPP_LOADING
                                  : item.loading === "loaded"
                                  ? i18n.ISNTAPP_LOADED
                                  : i18n.ISNTAPP_FEIL_TO_LOAD}
                              </span>

                              <span className={classes.refreshTime}>
                                {item.loading !== "loading" && item.date}
                              </span>
                            </Typography>
                          }
                        />
                        {item.loading === "loading" && (
                          <img
                            src={Loading}
                            className={classes.loading}
                            alt=""
                          />
                        )}
                      </ListItem>
                      {index === 0 &&
                        item.label !== "Synchronize Task list" && <Divider />}
                    </Box>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      <ConfirmModal
        open={open}
        onClose={()=>setOpen(false)}
        handleClick={() => confirmRefresh()}
        children={<TextField
          label={i18n.ISNTAPP_INPUT_PE_JOB_NO}
          style={{ margin: 8 }}
          fullWidth
          margin="normal"
          onChange={(event) => setUserInfo({pNumber:event.target.value})}
        />}
      />

      <ConfirmModal
        open={SODialog}
        onClose={() => setSODialog(false)}
        handleClick={() => SONO?.orderNo && confirmSO()}
        children={<TextField
          label={i18n.ISNTAPP_INPUT_ORDER_NO}
          style={{ margin: 8 }}
          value={SONO?.orderNo||""}
          fullWidth
          margin="normal"
          onChange={(event) => setSONO({ ...SONO,orderNo: event.target.value})}
        />}
      />
      </PrimaryLayout>
  );
};

export default connect(
  ({ projects, refreshTime, requestStatus,auth }) => {
    return { projects, refreshTime, requestStatus,auth };
  },
  (dispatch) => {
    return {
      refresh: (name, projects, userInfo) => {
        recordRefreshTime(dispatch, name, projects, userInfo);
      },
      updateOrdersData: (soNo) => {
        updateOrdersData(soNo, dispatch)
      }
    };
  }
)(SynchronizePage);
