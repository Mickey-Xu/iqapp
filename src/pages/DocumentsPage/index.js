import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  withStyles,
  Divider,
  Button,
  AccordionActions,
  List,
  Checkbox
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import * as action from "actions";
import Model from "components/Model";
import Pdf from "components/Pdf";
import { LocalizeContext } from "i18n";
import { documentAuthorizationC } from "js/publicFn";
import { getTemplateList,  showUploadButton } from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Square from "img/square.png"
import Triangle from "img/triangle.png"
import { makeStyles } from "@material-ui/styles";


const getSquareORTriangle = (type) => {
  let imgSource = type === "Square" ? Square : type === "Triangle" ? Triangle : "No";
  return imgSource === "No" ? imgSource : <img src={imgSource} alt="" />
}

const getSpecifyStr = (item) => {
  const str = "Chinese:";
  var splitChar = item.split("||");

  return splitChar
    .find((e) => {
      return (
        e.startsWith(str) ||
        (splitChar.findIndex((e) => e.startsWith(str)) === -1 && splitChar[0])
      );
    })
    .split(":")
    .slice(-1)[0];
};

// const isShowUpLoadButon = (allowreupload, param, documents) => {
//   if (documents.length > 0) {
//     if (!allowreupload) {
//       return false
//     } else {
//       if (getChecklistActivityNo(param)) {
//         return false
//       } else {
//         return true;
//       }
//     }
//   } else {
//     return true
//   }
// }

const dynamicDisplay = (root, config, version) => {
  if (root === "listCard") {
    if (version !== "Latest") {
      return false
    }
    return config.closeEnabledInOILScreen
  } else if (root === "installationChecklist") {
    if (version !== "Latest") {
      return false
    } else {
      return true
    }

  }
  return false
}

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    "& .MuiAccordionSummary-content.Mui-expanded": {
      margin: 0
    },
    "& .MuiAccordionSummary-content": {
      margin: 0
    },
    "& .MuiAccordionSummary-root.Mui-expanded": {
      minHeight: "auto",
      paddingTop: spacing(1)
    }

  },
}))

const ListofIncongruentItems = ({ data, getHistoryList, version, root, nonConformityConfig, activityNo, closeNonConfirmityItems }) => {
  const i18n = React.useContext(LocalizeContext);
  const [expanded, setExpanded] = React.useState(true);

  const classes = useStyles();

  const handleChange = (event, newExpanded) => {
    setExpanded(newExpanded);
  };

  let canClick = true;

  return <List component="nav" aria-label="contacts" style={{ marginBottom: 20 }}>
    {version === "Latest" &&
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Button size="large" color="secondary" onClick={() => getHistoryList()}>历史</Button>
        {dynamicDisplay(root, nonConformityConfig[activityNo], version) && data.nonConformities.find(item => item.nonConformityItems.length > 0) &&
          <Button size="large" color="secondary" onClick={() =>
            
          {
            if (!canClick) {
              alert('请稍候再试！');
              return;
            };

            setTimeout(() => {
              canClick = true;
            }, 2000); 
        
            canClick = false;
            closeNonConfirmityItems(data)
          }
          
          }>{i18n.Close_NONCONFORMANCE_ITEMS}</Button>
        }
      </Box>
    }
    <Accordion className={classes.root} style={{ margin: "0 16px" }} expanded={expanded} onChange={handleChange}>
      <AccordionSummary style={{ margin: 0 }}>
        <ArrowRightIcon fontSize="large" style={expanded ? { transform: "rotate(90deg)" } : {}} />
        <Typography variant="h6">{version === "Latest" ? `当前版本` : `版本：${version}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box style={{ width: "100%" }}>
          {data.nonConformities.map((key, index) => {
            return (
              <Box key={index} ml={2} mr={2}>
                <Typography
                  style={{ fontWeight: 600 }}
                  gutterBottom
                  variant="body2"
                  component="h2"
                >
                  {key.documentName}
                </Typography>
                <Box>
                  {key.nonConformityItems.map((item, index) => {
                    return (
                      <Grid key={index} container >
                        <Grid item xs={8}>
                          <Typography variant="caption">{getSpecifyStr(item.itemName)}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <p style={{ fontWeight: 800, paddingLeft: 24, marginBottom: 0, marginTop: 8 }}> {getSquareORTriangle(item.questionType)}</p>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "end" }}>
                          {dynamicDisplay(root, nonConformityConfig[activityNo], version) &&
                            <Checkbox
                              style={{ padding: 4 }}
                              color="default"
                              inputProps={{ 'aria-label': 'checkbox with default color' }}
                              onChange={(event) => {
                                let checkedVlaue = event.target.checked;
                                item["itemValue"] = checkedVlaue ? "yes" : "no"
                                item["activityNo"] = key.activityNo

                              }}
                            />
                          }
                        </Grid>
                      </Grid>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>

  </List>
};


const Template = withStyles(({ spacing }) => ({
  root: {
    padding: 0,
  },
  add: {
    marginLeft: spacing(5),
  },
  navIcon: {
    transform: "rotate(90deg)",
  },
  documentName: {
    marginLeft: spacing(1),
  },
}))(
  ({
    classes,
    template: {
      activityNo,
      documentNo,
      documentPart,
      mandDoc,
      documentDescription,
      productFamily,
      productLine,
      language,
    },
    orderNo,
    projectNumber,
    fetchPdf,
    documents,
    foe,
    region,
    branch,
    DisableTheEntranceroot,
    canUploadDoc,
    fetchNoConformityList,
    root,
    i18n,
    fetchHistoryList,
    nonConformityConfig,
    closeNonConfirmity
  }) => {
    const [expanded, setExpanded] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [modelContent, setModelContent] = React.useState();
    const [title, setTitle] = React.useState(documentDescription);
    const [data, setData] = React.useState([]);
    useEffect(() => {
      setModelContent(
        data.map((item, index) =>
          < ListofIncongruentItems
            key={index}
            data={item}
            getHistoryList={getHistoryList}
            version={item?.versionIdentifier}
            root={root}
            nonConformityConfig={nonConformityConfig}
            activityNo={activityNo}
            closeNonConfirmityItems={closeNonConfirmityItems}
          />))
      // eslint-disable-next-line
    }, [data]);


    const handleClickOpen = (name) => {
      const data = {
        ProjectNo: projectNumber,
        OrderNo: orderNo,
        ActivityNo: activityNo,
        DocumentName: name,
        foe,
        region,
        branch,
      };
      root === "installationChecklist" && delete data.ActivityNo;
      fetchPdf(data).then((url) => {
        setOpen(true);
        setModelContent(<Pdf filePath={url} />);
      });
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleChange = (event, newExpanded) => {
      setExpanded(newExpanded);
    };

    const getHistoryList = () => {
      const param = {
        ProjectNo: projectNumber,
        OrderNo: orderNo,
        ActivityNo: root === "listCard" ? activityNo : "",
        Description: root === "listCard" ? documentDescription : "",
        foe,
        region,
        branch,
      };
      fetchHistoryList(param).then((res) => {
        const newData = res.data.map((item, index) => {
          return {
            nonConformities: item.nonConformities,
            versionIdentifier: res.data.length - index
          }
        });
        const historyData = [
          ...data, ...newData
        ]
        const result = Array.from(new Set(historyData.map(JSON.stringify))).map(JSON.parse);
        setData(result)
      })
    }

    const closeNonConfirmityItems = (checkContent) => {

      const filteredData = checkContent?.nonConformities?.filter(item => {
        return item.nonConformityItems.some(subItem => subItem.itemValue === "yes");
      });

      let checkedData = filteredData.map((item) => {
        return {
          documentInfo: {
            projectNo: projectNumber,
            orderNo: orderNo,
            activityNo: item.activityNo,
            description: item.documentName,
            foe,
            region,
            branch,
          },
          items: item.nonConformityItems,
        }
      })

      if (checkedData.length < 1) {
        alert("至少要选择一个不符合项")
        return false
      }
      closeNonConfirmity(checkedData).then((res) => {
        setOpen(false);
      })
    }


    const getNoConformityList = (param) => {
      setTitle(i18n.NONCONFORMITY_LIST);
      fetchNoConformityList(param).then((res) => {
        setOpen(true);
        res.data["versionIdentifier"] = "Latest"
        setData(res.data)
      })
    }
    const showButton = showUploadButton() ? (showUploadButton() && DisableTheEntranceroot && canUploadDoc) : (DisableTheEntranceroot && canUploadDoc)
    const history = useHistory();
    return (
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary className={classes.root}>
          <ArrowRightIcon className={expanded ? classes.navIcon : ""} />
          {mandDoc === "X" ? (
            <Typography color="error">{documentDescription}*</Typography>
          ) : (
            <Typography>{documentDescription}</Typography>
          )}

          {showButton &&
            (
              <AddCircleOutlineIcon
                color="error"
                className={classes.add}
                onClick={(event) => {
                  event.stopPropagation();
                  history.push(
                    `/template/${documentNo}/${documentPart}/${activityNo}/${orderNo}/${projectNumber}/${productFamily}/${productLine}/${language}`
                  );
                }}
              />
             )}
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {documents[0] &&
              (root === "installationChecklist"
                ? documents
                : Array.from(new Set(documents)).filter((item) => {
                  return (
                    item.name.indexOf(documentDescription) > -1 &&
                    item.name === documentDescription + ".pdf"
                  );
                })
              ).map((item, index) => {
                return (
                  <Grid
                    className={classes.documentName}
                    key={index}
                    item
                    xs={12}
                    onClick={() => {
                      setTitle(documentDescription);
                      handleClickOpen(item.name);
                    }}
                  >
                    {item.name}
                  </Grid>
                );
              })}
          </Box>
        </AccordionDetails>
        {documents.length > 0 && (
          <Box>
            <Divider />
            <AccordionActions>
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  const param = {
                    ProjectNo: projectNumber,
                    OrderNo: orderNo,
                    ActivityNo: activityNo,
                    Description: documentDescription,
                    foe,
                    region,
                    branch,
                  };
                  root === "installationChecklist" && delete param.ActivityNo;
                  getNoConformityList(param);
                }}
              >
                {i18n.VIEW_NONCONFORMANCE_ITEMS}
              </Button>
            </AccordionActions>
          </Box>
        )}
        <Model open={open} title={title} handleClose={handleClose}>
          {modelContent}
        </Model>
      </Accordion>
    );
  }
);

const DocumentsPage = withStyles(({ spacing }) => ({
  root: {
    margin: spacing(2),
  },
  content: {
    marginBottom: spacing(5),
  },
  title: {
    lineHeight: "2.5",
  },
}))(
  ({
    descriptionShort,
    classes,
    data,
    orderNo,
    projectNumber,
    fetchPdf,
    documents,
    foe,
    region,
    branch,
    DisableTheEntranceroot,
    canUploadDoc,
    root,
    fetchNoConformityList,
    getHistoryList,
    nonConformityConfig,
    closeNonConfirmityItems
  }) => {
    const i18n = React.useContext(LocalizeContext);
    const [pageDescription, setPageDescription] = React.useState(
      i18n.INSTALLATION_ACTIVITY_DOCUMENT
    );

    const pageSource =
      root === "minCard" ? "all" : root === "listCard" ? "pending" : "basic";

    useEffect(() => {
      if (root === "installationChecklist")
        setPageDescription(i18n.INSTALLATION_CHECKLIST);
    }, [root, i18n]);
    return (
      <PrimaryLayout
        name="activity Document"
        root={pageSource}
        title={pageDescription}
      >
        <Box className={classes.root}>
          <Box
            fontSize="h6.fontSize"
            fontWeight="fontWeightMedium"
            my={1}
          >{`${orderNo}`}</Box>
          <Typography variant="body1" className={classes.title}>
            {descriptionShort}
          </Typography>
          <Box className={classes.content}>
            {data.map((item, index) => {
              return (
                <Template
                  template={item}
                  key={index}
                  orderNo={orderNo}
                  projectNumber={projectNumber}
                  fetchPdf={fetchPdf}
                  documents={documents}
                  foe={foe}
                  region={region}
                  branch={branch}
                  DisableTheEntranceroot={DisableTheEntranceroot}
                  canUploadDoc={canUploadDoc}
                  fetchNoConformityList={fetchNoConformityList}
                  root={root}
                  i18n={i18n}
                  fetchHistoryList={getHistoryList}
                  nonConformityConfig={nonConformityConfig}
                  closeNonConfirmity={closeNonConfirmityItems}
                />
              );
            })}
          </Box>
        </Box>
      </PrimaryLayout>
    );
  }
);

export default connect(
  (
    { activities, orderActivities, documentList, templates, orders, auth, nonConformityConfig },
    {
      match: {
        params: { activityNo, orderNo, productFamily, root },
      },
    }
  ) => {
    const projectNumber = orders[orderNo]?.projectNumber;
    const productCategory = orders[orderNo]?.productCategory;
    const productLine = orders[orderNo]?.productLine;
    const templatesData = templates[activityNo] || [];
    let order = orders?.[orderNo];
    const documents = [];
    const documentsItem = documentList[projectNumber]?.[orderNo]?.[activityNo];

    const data = getTemplateList(templatesData, productLine, productFamily, productCategory);
    const description = data.map((item) => {
      return item.documentDescription;
    });


    description.forEach((item) => {
      return (
        (documentsItem &&
          documentsItem.filter(
            (ele) => ele.name.indexOf(item) > -1 && documents.push(ele)
          )) ||
        []
      );
    });

    const docAuthActivityNos = documentAuthorizationC(
      orderActivities,
      orderNo,
      auth.activityAuth,
      auth.roles[0]
    );

    const canUploadDoc = docAuthActivityNos.includes(activityNo);

    const { descriptionShort, descriptionShort14 } =
      activities[activityNo] || {};

    const title = orderActivities[orderNo + "-7030"]
      ? descriptionShort14
        ? descriptionShort14
        : descriptionShort
      : descriptionShort;

    if (root === "installationChecklist") {
      const template = {
        mandDoc: "Y",
        documentDescription: `安装检查清单`,
      };

      data.push(template);

      documents.push(documentList?.[projectNumber]?.[orderNo]?.[activityNo][0]);
    }

    return {
      data: data,
      descriptionShort: title,
      orderNo,
      projectNumber,
      documents,
      foe: order?.fo,
      region: order?.region,
      branch: order?.prctr,
      DisableTheEntranceroot: root === "listCard",
      canUploadDoc,
      root: root,
      nonConformityConfig
    };
  },
  (dispatch) => {
    return {
      fetchPdf: (data) => {
        return dispatch(action.fetchPdf(data));
      },

      fetchNoConformityList: (data) => {
        return dispatch(action.getNoConformityList(data));
      },

      getHistoryList: (data) => {
        return dispatch(action.getHistoryList(data));
      },

      closeNonConfirmityItems: (data) => {
        return dispatch(action.closeNonConfirmityItems(data));

      }

    };
  }
)(DocumentsPage);
