import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Typography,
  withStyles,
} from "@material-ui/core";
import * as action from "actions";
import Model from "components/Model";
import Pdf from "components/Pdf";
import { LocalizeContext } from "i18n";
import PrimaryLayout from "layouts/PrimaryLayout";
import { default as React, useEffect } from "react";
import { connect } from "react-redux";
import FFTab from "components/FFTab";

const Template = withStyles(({ spacing }) => ({
  root: {
    padding: 0,
  },
  box: {
    width: "90%",
    display: "flex",
    justifyContent: "space-between",
    margin: "0 auto",
  },
}))(({ classes, preview, name, id }) => {
  const [expanded] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [pdfurl, setPdfurl] = React.useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (id) => {
    preview(id).then((url) => {
      setPdfurl(url);
      setOpen(true);
    });
  };

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary className={classes.root}>
        <Box className={classes.box}>
          <Typography style={{ lineHeight: "36px" }} color="error">
            {name}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            style={{ height: "fit-content" }}
            onClick={() => handleClickOpen(id)}
          >
            预览
          </Button>
        </Box>
      </AccordionSummary>
      <Model open={open} title={name} handleClose={handleClose}>
        <Pdf filePath={pdfurl} />
      </Model>
    </Accordion>
  );
});

const UserManualPage = withStyles(({ spacing }) => ({
  root: {
    width: "90%",
    fontWeight: "500",
    margin: spacing(2, "auto"),
  },
  list: {
    padding: 0,
  },
  listItem: {
    marginBottom: spacing(3),
    backgroundColor: "#fff",
  },
}))(({ preview, classes, getUserManual }) => {
  const i18n = React.useContext(LocalizeContext);
  const [data, setData] = React.useState([]);
  const [tabs, setTabs] = React.useState([]);
  const [tabItem, setTabItem] = React.useState();

  const getData = () => {
    getUserManual().then((res) => {
      const tabName = [
        ...new Set(
          res.map((item) => {
            return item.type;
          })
        ),
      ].map((item) => {
        return { title: item, value: item };
      });

      setTabItem(tabName?.[0]?.title);
      setTabs(tabName);
      setData(res);
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PrimaryLayout
      name="activity Document"
      title={i18n.INSTALLATION_USER_MANUAL}
    >
      {tabItem && (
        <FFTab
          tabs={tabs}
          selectedTabValue={tabItem}
          onTabChange={(value) => {
            setTabItem(value);
          }}
        />
      )}

      <Box className={classes.root}>
        {data?.length > 0 &&
          data
            .filter((item) => item.type === tabItem)
            .map((item, index) => {
              return (
                <Template
                  key={index}
                  preview={preview}
                  name={item.name}
                  id={item.id}
                />
              );
            })}
      </Box>
    </PrimaryLayout>
  );
});

export default connect(
  ({ state }, { ownProps }) => {
    return {};
  },
  (dispatch) => {
    return {
      getUserManual: () => {
        return dispatch(action.getUserManual());
      },
      preview: (id) => {
        return dispatch(action.getPdfData(id));
      },
    };
  }
)(UserManualPage);
