import { Box, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as action from "actions";
import ConfirmModal from "components/ConfirmModal";
import { TitlePage } from "components/TemplateForm/TitlePage";
import { LocalizeContext } from "i18n";
import { Base64 } from "js-base64";
import { deserialize, serialize } from "js/sfdl";
import {
  componentGenerator,
  initProps,
  isVisible,
  tmplLangMapper,
} from "js/templateFormUtil";
import {
  deleteDraftFromLocal,
  isFormUpdated,
  verify,
  removeNotVisibleFields,
} from "js/util";
import PrimaryLayout from "layouts/PrimaryLayout";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as repo from "js/fetch";
import FilterIcon from "../../assets/img/filter.png";
import TemplateFilter from "../../components/TemplateFilter"

const TemplatePage = withStyles(({ spacing }) => {
  return {
    root: {
      width: "100%",
      fontWeight: 500,
      position: "fixed",
      top: "54px",
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: " #efe9e9",
      borderBottom: "1px solid #eae9e9",
      zIndex: "1",
    },
    btn: {
      color: "#123db5",
      textTransform: "capitalize",
      marginRight: spacing(2),
    },
    container: {
      margin: spacing(7, 2, 0, 2),
    },
  };
})(
  ({
    description,
    savePDF,
    classes,
    formState,
    fieldsState,
    getTemplateForm,
    templateFormData,
    initTemplateForm,
    storeCurrentParams,
    activityNo,
    orderNo,
    projectNumber,
    fo: foe,
    region,
    prctr: branch,
    saveAndReturn,
    removeTemplateState,
    productFamily,
    productLine,
    language,
  }) => {
    const i18n = React.useContext(LocalizeContext);
    let { documentNo, documentPart } = useParams();
    const [initData, setInitData] = useState(null);
    const [dialog, setDialog] = React.useState(false);
    const [checked, setChecked] = React.useState([1]);
    const [templateForm, setTemplateForm] = useState({ fields:[]});

    const useInitForm = () => {
      useEffect(() => {
        getTemplateForm(
          {
            documentNo,
            documentPart,
          },
          {
            ProjectNo: projectNumber,
            orderNo,
            activityNo,
            description,
            branch,
            foe,
            region,
          },
          {
            activityNo,
            productFamily,
            productLine,
            language,
          }
        ).then((res) => {
          if (!res) {
            return false
          }
          initTemplateForm(
            documentNo,
            documentPart,
            activityNo,
            productFamily,
            productLine,
            language,
            res.value,
            { orderNo }
          ).then((data) => {
            setInitData(data);
          });
          if (res.code === 2) {
            alert("模板有更新，之前草稿已被清理");
            deleteDraftFromLocal({
              documentNo,
              documentPart,
            });
          }
        });

        storeCurrentParams({
          documentNo,
          documentPart,
          activityNo,
          productFamily,
          productLine,
          language,
        });
      }, []);
    };

    useInitForm();

    const history = useHistory();
    const [open, setOpen] = useState(false);

    const closeMenu = () => {
      removeTemplateState(
        documentNo,
        documentPart,
        activityNo,
        productFamily,
        productLine,
        language
      );
      history.goBack();
      setOpen(false);
    };

    const submit = (e) => {
      const result = verify(templateFormData.fields);
      if (result) {
        let data = {
          projectNo: projectNumber,
          orderNo: orderNo,
          activityNo: activityNo,
          description: description,
          branch,
          foe,
          region,
          override: true,
          form: Base64.encode(
            serialize(removeNotVisibleFields(templateFormData))
          ),
        };
        let draftData = {
          projectNo: projectNumber,
          orderNo: orderNo,
          activityNo: activityNo,
          description: description,
          branch: branch,
          foe: foe,
          region: region,
          form: Base64.encode(serialize(templateFormData)),
        };
        savePDF(data, draftData, {
          documentNo,
          documentPart,
          activityNo,
          productFamily,
          productLine,
          language,
        });
      }
    };

    const goBack = () => {
      if (
        isFormUpdated(templateFormData, deserialize(Base64.decode(initData)))
      ) {
        setOpen(true);
      } else {
        removeTemplateState(
          documentNo,
          documentPart,
          activityNo,
          productFamily,
          productLine,
          language
        );
        history.goBack();
      }
    };

    const saveDraft = (type) => {
      setOpen(false);
      let data = {
        projectNo: projectNumber,
        orderNo: orderNo,
        activityNo: activityNo,
        description: description,
        branch: branch,
        foe: foe,
        region: region,
        form: Base64.encode(serialize(templateFormData)),
      };

      const currentParams = {
        documentNo,
        documentPart,
      };

      if (type === "save") {
        saveAndReturn(data, currentParams, {
          productFamily,
          productLine,
          language,
        }).then((res) => {
          setInitData(data.form);
          alert("草稿保存成功");
        });
      } else {
        saveAndReturn(data, currentParams, {
          productFamily,
          productLine,
          language,
        }).then(() => {
          history.goBack();
          removeTemplateState(
            documentNo,
            documentPart,
            activityNo,
            productFamily,
            productLine,
            language
          );
        });
      }
    };

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
    };

    const confirmFilter = () => {      
      if (checked.length > 1) {
        const checkedId = [];
        checked.forEach((item) => item?.id && checkedId.push(item.id))
        const fields = []
        checkedId.forEach(item => {
          templateFormData["fields"].forEach((field) => {
            field.settings.tagRules.forEach((tagRule) => {
              item === tagRule.tagId && fields.push(field)
            })
          })
        });
        console.log(fields)
        setTemplateForm({ ...templateFormData, fields: fields })
      } else {
        setTemplateForm(templateFormData)
      }
      setDialog(false)
    }

    return (
      <PrimaryLayout
        title={i18n.ISNTAPP_TEMPLATE}
        isDirectReturn={false}
        isFetchAll={false}
        goBack={goBack}
      >
        <Box className={classes.root}>
          {templateFormData?.form["settings"]["tagUniverse"].length > 0 ? <Button
            onClick={() => setDialog(true)}
          >
            <img src={FilterIcon} alt="" />
          </Button>:<Box></Box>}
          <Box>
            <Button className={classes.btn} onClick={() => saveDraft("save")}>
              {i18n.ISNTAPP_SAVE_AS_PDF}
            </Button>
            <Button className={classes.btn} onClick={() => submit()}>
              {i18n.ISNTAPP_TEMPLATE_UPLOAD}
            </Button>
            </Box>
        </Box>
        <Box className={classes.container}>
          <TitlePage {...formState} />
          {(checked.length > 1 ? templateForm["fields"] : fieldsState).map((field) => {
            return isVisible(field)
              ? componentGenerator(field, initProps(field, language))
              : null;
          })}
        </Box>
        <ConfirmModal
          open={open}
          onClose={closeMenu}
          handleClick={() => saveDraft()}
        >
          {i18n.INSTALLATION_DO_YOU_WANGT_TO_SAVE_THE_DRAFT}
        </ConfirmModal>
        <TemplateFilter
          templateForm={templateFormData}
          open={dialog}
          setOpen={setDialog}
          handleToggle={handleToggle}
          checked={checked}
          confirmFilter={confirmFilter}
        />
      </PrimaryLayout>
    );
  }
);

const mapStateToProps = ({ templateForm, templates, orders }, ownProps) => {
  let {
    activityNo,
    documentPart,
    orderNo,
    projectNumber,
    documentNo,
    productFamily,
    productLine,
    language,
  } = ownProps.match.params;

  const key =
    documentNo +
    "-" +
    documentPart +
    "-" +
    activityNo +
    "-" +
    productFamily +
    "-" +
    productLine +
    "-" +
    language;

  let formState = {};
  let fieldsState = [];
  if (templateForm[key]) {
    formState = {
      title: templateForm[key].form?.settings.titleI18n[
        tmplLangMapper[language]
      ]
        ? templateForm[key].form?.settings.titleI18n[tmplLangMapper[language]]
        : templateForm[key].form?.settings.titleI18n.English,
      description: templateForm[key].form?.settings.descriptionI18n[
        tmplLangMapper[language]
      ]
        ? templateForm[key].form?.settings.descriptionI18n[
            tmplLangMapper[language]
          ]
        : templateForm[key].form?.settings.descriptionI18n.English,
      logos: templateForm[key].form?.settings.logos,
      identifier: templateForm[key].form?.settings.identifier,
    };
    fieldsState = templateForm[key].fields;
  }

  let templateFormData = templateForm[key];

  let description = templates[activityNo]?.find(
    (item) =>
      item.documentPart === documentPart &&
      item.documentNo === documentNo &&
      item.productFamily ===
        (productFamily === "null" ? null : productFamily) &&
      item.productLine === (productLine === "null" ? null : productLine) &&
      item.language === language
  ).documentDescription;
  let order = orders?.[orderNo];
  return {
    formState,
    fieldsState,
    templateFormData,
    activityNo,
    orderNo,
    projectNumber,
    description,
    fo: order?.fo,
    region: order?.region,
    prctr: order?.prctr,
    productFamily,
    productLine,
    language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeCurrentParams: (param) => {
      dispatch(action.storeCurrentParams(param));
    },
    getTemplateForm: (param, draftParam, expendParam) => {
      dispatch(action.fetchAll(repo.type.CACHE));
      return dispatch(action.fetchTemplateForm(param, draftParam, expendParam));
    },
    initTemplateForm: (
      documentNo,
      documentPart,
      activityNo,
      productFamily,
      productLine,
      language,
      data,
      routeParams
    ) => {
      return dispatch(
        action.initTemplateForm(
          documentNo,
          documentPart,
          activityNo,
          productFamily,
          productLine,
          language,
          data,
          routeParams
        )
      );
    },
    savePDF: (data, draftData, param) => {
      dispatch(action.uploadDocumentForm(data, draftData, param));
    },
    saveAndReturn: (data, currentParams, extendParam) => {
      return dispatch(action.saveDraft(data, currentParams, extendParam));
    },
    removeTemplateState: (
      documentNo,
      documentPart,
      activityNo,
      productFamily,
      productLine,
      language
    ) => {
      dispatch(
        action.removeTemplateFormState({
          documentNo,
          documentPart,
          activityNo,
          productFamily,
          productLine,
          language,
        })
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplatePage);
