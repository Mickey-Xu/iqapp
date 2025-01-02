import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
  DescriptionOutlined,
  EventAvailableOutlined,
  EventNoteOutlined,
  // LockOpenOutlined,
  // LockOutlined,
  ScheduleOutlined,
} from "@material-ui/icons";
import { LocalizeContext } from "i18n";
import { isInstallationStep } from "js/installationStep";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  toDoOrDone,
  verifyWhenConfirm7020or70C0,
  checkFileIsExisting,
  getTemplateList
} from "../../js/util";
import * as action from "actions";

const OrderActivityListCard = withStyles(({ spacing }) => {
  return {
    button: {
      borderRadius: spacing(2.5),
      textTransform: "capitalize",
      lineHeight: "unset",
      fontSize: "0.5rem",
      padding: "2px 14px",
    },
    card: {
      marginTop: spacing(2),
      // borderTopStyle: "solid",
      // borderTopColor: "#ff0000",
    },
    cardActions: {
      marginLeft: "0px",
    },
    label: {
      whiteSpace: "nowrap",
    },
  };
})(
  ({
    classes,
    data,
    document,
    handleClickOpen,
    tabType,
    orderActivities,
    documentList,
    orders,
    templates,
    fetchNoConformityList
  }) => {
    // console.log(data);
    const i18n = React.useContext(LocalizeContext);
    const root = "listCard";
    const history = useHistory();
    const action = [
      // {
      //   label: i18n.ORDERDETAILS_LOCK,
      //   name: "Lock",
      //   component: (auth) => (
      //     <LockOutlined
      //       color={auth.isExecutable.Lock ? "action" : "disabled"}
      //       onClick={() =>
      //         handleClickOpen(
      //           "lock",
      //           data.activityNumber,
      //           (tabType ? data.activityNumber : data.stepNumber) +
      //             " " +
      //             data.descriptionShort
      //         )
      //       }
      //     />
      //   ),
      // },
      // {
      //   label: i18n.ORDERDETAILS_UNLOCK,
      //   name: "unLock",
      //   component: (auth) => (
      //     <LockOpenOutlined
      //       color={auth.isExecutable.unLock ? "action" : "disabled"}
      //       onClick={() =>
      //         handleClickOpen(
      //           "unlock",
      //           data.activityNumber,
      //           (tabType ? data.activityNumber : data.stepNumber) +
      //             " " +
      //             data.descriptionShort
      //         )
      //       }
      //     />
      //   ),
      // },
      {
        label: i18n.GENERAL_CONFIRM,
        name: "Confirm",
        component: (auth) => (
          <CheckCircleOutlineOutlined
            color={auth.isExecutable.Confirm ? "action" : "disabled"}
            onClick={() => {
              const result = verifyWhenConfirm7020or70C0(
                orderActivities,
                data.orderNumber,
                data.activityNumber
              );
              if (result) {
                alert(result.stepNo + result.message);
                return;
              }



              const templateDataList = getTemplateList(
                templates[data.activityNumber] || [],
                orders[data.orderNumber].productLine,
                orders[data.orderNumber].productFamily,
                orders[data.orderNumber].productCategory
              );

              const param = templateDataList.map((item) => {
                return {
                  foe: orders[data.orderNumber].fo,
                  region: orders[data.orderNumber].region,
                  branch: orders[data.orderNumber].prctr,
                  ProjectNo: orders[data.orderNumber].projectNumber,
                  OrderNo: data.orderNumber,
                  ActivityNo: data.activityNumber,
                  Description: item.documentDescription,
                };
              });

              checkFileIsExisting(templates, data, orders).then((message) => {
                if (message.length < 1) {
                  param.map(item =>
                    fetchNoConformityList(item).then((res) => {
                      const foundItems = res.data?.[0].nonConformities?.flatMap(key =>
                        key.nonConformityItems.filter(
                          subItem => subItem.questionType === "Triangle" && subItem.itemValue === "no"
                        )
                      );

                      if (foundItems.length > 0) {
                        alert(`您有${foundItems.length}个三角项检查项未关闭，请关闭三角项后再确认节点`);
                        return false;
                      };
                    })
                  )
                  handleClickOpen(
                    "confirm",
                    data.activityNumber,
                    (tabType ? data.activityNumber : data.stepNumber) +
                    " " +
                    data.description
                  );
                } else {
                  alert(`请上传 ${message.toString()}`);
                }
              });
            }}
          />
        ),
      },
      {
        label: i18n.GENERAL_CANCEL,
        name: "Cancel",
        component: (auth) => (
          <CancelOutlined
            color={auth.isExecutable.Cancel ? "action" : "disabled"}
            onClick={() =>
              handleClickOpen(
                "cancel",
                data.activityNumber,
                (tabType ? data.activityNumber : data.stepNumber) +
                " " +
                data.description
              )
            }
          />
        ),
      },
      {
        label:
          document === "Done"
            ? i18n.ISNTAPP_JOBLIST_DOC_DONE
            : document === "ToDo"
              ? i18n.ISNTAPP_JOBLIST_DOC_TODO
              : i18n.ISNTAPP_WITHOUT_TEMPLATES,
        name: "Document",
        component: () => (
          <DescriptionOutlined
            style={{ margin: "auto" }}
            color={
              document === "Done" || document === "ToDo" ? "action" : "disabled"
            }
            onClick={() => {
              history.push(
                `/documents/${data.activityNumber}/${data.orderNumber}/${data.productFamily}/${root}`
              );
            }}
          />
        ),
      },
    ];

    return (
      <Card className={classes.card}>
        <CardContent>
          <Button
            disabled
            variant="contained"
            style={{
              backgroundColor: data.isExecutable.Confirm ? "#8bc34a" : "",
              color: data.isExecutable.Confirm ? "white" : "black",
            }}
            classes={{ root: classes.button }}
          >
            {data.info} {data.hint && i18n.ISNTAPP_NO_PERMISSION}
          </Button>
          <Box mt={2}>
            <Box style={{ display: "inline-flex" }}>
              <ScheduleOutlined color="action" style={{ fontSize: "1.4rem" }} />
              <Typography variant="body1" fontWeight={500}>
                {!isInstallationStep(data.activityNumber)
                  ? i18n.JOBLIST_ACTIVITY
                  : i18n.ISNTAPP_JOBLIST_INST_STEPS}
                : {data.activityNumber + " " + data.description}
              </Typography>
            </Box>
          </Box>
          <Box mt={1.5}>
            <Grid container>
              <Grid item xs={6} style={{ display: "inline-flex" }}>
                <EventNoteOutlined
                  style={{ fontSize: "1.05rem" }}
                  color="action"
                />
                <Typography variant="caption">
                  {i18n.PROJECTLIST_PLANNED_FINISH}: {data.leadingDate}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: "inline-flex",
                  justifyContent: "flex-start",
                }}
              >
                <EventAvailableOutlined
                  style={{ fontSize: "1.05rem" }}
                  color="action"
                />
                <Typography variant="caption">
                  {i18n.PROJECTLIST_CONFIRMED_FINISH}: {data.confirmedDate}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions style={{ backgroundColor: "#f5f5f5", overflow: "auto" }}>
          {action.map((item, index) => {
            const Component = item.component;
            let disabled = false;

            if (item.name === "Lock") {
              disabled = !data.isExecutable.Lock;
            }

            if (item.name === "unLock") {
              disabled = !data.isExecutable.unLock;
            }

            if (item.name === "Confirm") {
              disabled = !data.isExecutable.Confirm;
            }

            if (item.name === "Cancel") {
              disabled = !data.isExecutable.Cancel;
            }

            if (item.name === "Document") {
              disabled = !(
                (document === "ToDo" || document === "Done") &&
                data.isExecutable.canReadDoc
              );
            }

            return (
              <Button
                size="small"
                key={index}
                disabled={disabled}
                style={{
                  display: "inline-grid",
                  flex: "auto",
                  marginLeft: "0px",
                }}
              >
                <Component isExecutable={data.isExecutable} />
                <Typography variant="caption" className={classes.label}>
                  {item.label}
                </Typography>
              </Button>
            );
          })}
        </CardActions>
      </Card>
    );
  }
);
export default connect(
  (
    { templates = [], documentList, orders, orderActivities },
    { data: { activityNumber: activityNo, orderNumber } }
  ) => {
    const projectNumber = orders[orderNumber]?.projectNumber;
    const document = toDoOrDone(
      projectNumber,
      orderNumber,
      activityNo,
      templates,
      documentList
    );

    return {
      document,
      orderActivities,
      documentList,
      orders,
      templates,
    };
  }, (dispatch) => {
    return {
      fetchNoConformityList: (data) => {
        return dispatch(action.getNoConformityList(data));
      },
    };
  }
)(OrderActivityListCard);
