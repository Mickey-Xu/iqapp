import * as action from "actions";
import {
  Checkboxes,
  DateTime,
  Dropdown,
  NaYesNo,
  NumberText,
  PageBreak,
  Paragraph,
  Photo,
  SectionBreak,
  Signature,
  SingleChoice,
  SingleLine,
  Slider,
  StaticText,
  YesNo,
} from "components/TemplateForm";
import store from "js/store";
import Moment from "moment";
import React from "react";
import { getListOfInstallationBranches } from "js/publicFn";

const defaultNaYesNoValues = {
  na: "N/A",
  fixed: "Fixed",
  yes: "Yes",
  no: "No",
};

const customizeNaYesNoValues = {
  yes: "YES",
  no: "NO",
  na: "N/A",
  notok: "Not OK",
  ok: "OK",
  square: "□",
  triangle: "▽",
  fixed: "Fixed",
};

const verifyNumber = (value, props) => {
  // if (value > props.max) {
  //   return props.max;
  // } else {
  //   if (value === "") {
  //     return "";
  //   }
  //   console.log(value)
    return value;
  // }
};

export const initFormState = (state, routeParams) => {
  state.fields.forEach((field) => {
    switch (field.type) {
      case "singleLine":
        if (!field.settings.value) {
          field.settings.value = field.settings.prefilledAnswer;
        }
        if (field.settings.value.indexOf("%%!") > -1) {
          const { orders, projects, partners, auth } = store.getState();
          const orderData = orders[routeParams.orderNo];
          const textFieldText = field.settings.value.slice(3, -3);
          const { description: projectName } =
            projects[orderData.projectNumber];
          const PM = partners[`${orderData["number"]}-YI`]?.name1;
          const PE = partners[`${orderData["number"]}-Z(`]?.name1;
          const InstallationClientName =
            partners[`${orderData["number"]}-Z&`]?.name1;
          const installationTeamLeader = partners[`${orderData["number"]}-SC`]
            ?.name1
            ? partners[`${orderData["number"]}-SC`]?.name1
            : partners[`${orderData["number"]}-VW`]?.name1;

          const branchName = getListOfInstallationBranches(orderData["prctr"]);
          field.settings.value =
            textFieldText === "orderno"
              ? orderData["number"]
              : textFieldText === "liftno"
              ? orderData["unitDesignation"]
              : textFieldText === "projectname"
              ? projectName
              : textFieldText === "instbranch"
              ? branchName
              : textFieldText === "pl"
              ? PM
              : textFieldText === "instcustname"
              ? InstallationClientName
              : textFieldText === "pe"
              ? PE
              : textFieldText === "tl"
              ? installationTeamLeader
              : textFieldText === "CurrentDate"
              ? auth?.CurrentDate
              : textFieldText === "LoginUserName"
              ? auth?.name
              : "";
        }
        break;
      case "yesNo":
        if (!field.settings.value) {
          field.settings.value = field.settings.initialValue;
        }
        break;
      case "slider":
        if (!field.settings.value) {
          field.settings.value = field.settings.initialValue;
        }
        break;
      case "paragraph":
        if (!field.settings.value) {
          field.settings.value = field.settings.prefilledAnswer;
        }
        break;
      case "naYesNo":
        if (
          (!field.settings.itemTexts && !field.settings.itemValues) ||
          (field.settings.itemTexts.length === 0 &&
            field.settings.itemValues.length === 0)
        ) {
          field.settings.itemTexts = [];
          field.settings.itemValues = [];

          field.settings.itemTexts.push("-");
          field.settings.itemValues.push("-");

          if (field.settings.notApplicableOption) {
            field.settings.itemValues.push("na");
            field.settings.itemTexts.push(defaultNaYesNoValues["na"]);
          }

          if (field.settings.fixedOption) {
            field.settings.itemValues.push("fixed");
            field.settings.itemTexts.push(defaultNaYesNoValues["fixed"]);
          }

          field.settings.itemValues.push("yes");
          field.settings.itemTexts.push(defaultNaYesNoValues["yes"]);

          field.settings.itemValues.push("no");
          field.settings.itemTexts.push(defaultNaYesNoValues["no"]);

          field.settings.buttonDescriptions.forEach((desc) => {
            for (let i = 0; i < field.settings.itemValues.length; i++) {
              if (desc.selectedButtonId === field.settings.itemValues[i]) {
                // field.settings.itemValues[i] = desc.selectedDescriptionId;
                field.settings.itemTexts[i] =
                  customizeNaYesNoValues[desc.selectedDescriptionId];
                break;
              }
            }
          });
        }

        if (!field.settings.value) {
          field.settings.value = "-";
        }
        break;
      case "photo":
        if (!field.settings.value) {
          field.settings.value =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
        break;
      case "date":
        if (!field.settings.value) {
          field.settings.value = Moment();
          if (field.settings.includeTime) {
            field.settings.value = Moment().format("YYYY-MM-DDTHH:mm");
          } else {
            field.settings.value = Moment().format("YYYY-MM-DD");
          }
        }
        break;
      case "number":
        // if (!field.settings.value) {
        //   field.settings.value = Number(
        //     field.settings.prefilledAnswer
        //       ? field.settings.prefilledAnswer
        //       : 0 || field.settings.prefilledAnswer === ""
        //       ? 0
        //       : field.settings.prefilledAnswer
        //   );
        // }
        if (!field.settings.value) {
          if (!field.settings.prefilledAnswer) {
            if (
              field.settings.prefilledAnswer === 0 ||
              field.settings.prefilledAnswer === "0" ||
              field.settings.prefilledAnswer
            ) {
              field.settings.value = field.settings.prefilledAnswer;
            } else {
              field.settings.value = "";
            }
          } else {
            const { auth } = store.getState();
            if (field.settings.prefilledAnswer === "%%!LoginUserNo!%%") {
              field.settings.value =auth?.personalNumber
            } else {
              field.settings.value = field.settings.prefilledAnswer;
            }
          }
        }
        break;
      case "multipleChoice":
        if (!field.settings.value) {
          // field.settings.value = field.settings.value
          //   ? field.settings.value
          //   : "";
          field.settings.value = "";
        }

        break;
      case "checkboxes":
        if (!field.settings.value) {
          field.settings.value = field.settings.value
            ? field.settings.value
            : [];
        }
        break;
      case "signature":
        if (!field.settings.value) {
          field.settings.value =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
        break;
      case "dropdown":
        if (!field.settings.value) {
          field.settings.value = field.settings.value
            ? field.settings.value
            : "";
        }
        break;
      default:
    }
  });

  return state;
};

export const initProps = (field, language) => {
  const lang = tmplLangMapper[language];

  const props = Object();
  props.id = field.id;
  props.key = field.id;
  switch (field.type) {
    case "checkboxes":
      props.value = field.settings.value;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.descriptionI18n = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.options = field.settings.options;
      props.required = field.settings.required;
      props.onChange = (value) => {
        props.value.indexOf(value) > -1
          ? props.value.splice(props.value.indexOf(value), 1)
          : props.value.push(value);
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: props.value,
          })
        );
      };
      return props;
    case "date":
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.descriptionI18n = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.includeTime = field.settings.includeTime;
      props.onChange = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e.target.value,
          })
        );
      };
      return props;
    case "dropdown":
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.helperText = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.options = field.settings.options;
      props.onChange = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e,
          })
        );
      };
      return props;
    case "number":
      props.prefilledAnswer = field.settings.prefilledAnswer;
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.helperText = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.unit = field.settings.unit;
      props.type = field.type;
      props.unitFront = field.settings.unitFront;
      props.min = field.settings.min;
      props.max = field.settings.max;
      props.onChange = (e, props) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value:
              props.max || props.min
                ? verifyNumber(e.target.value, props).toString()
                : e.target.value,
          })
        );
      };
      return props;
    case "multipleChoice":
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.helperText = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.options = field.settings.options;
      props.onChange = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e.target.value,
          })
        );
      };
      return props;
    case "singleLine":
      props.identifier = field.settings.identifier;
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.helperText = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.onChange = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e.target.value,
          })
        );
      };
      return props;
    case "yesNo":
      props.value = field.settings.value;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.onChange = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e.target.checked,
          })
        );
      };
      return props;
    case "staticText":
      props.value = field.settings.textI18n[lang]
        ? field.settings.textI18n[lang]
        : field.settings.textI18n.English;
      props.images = field.settings.images;
      props.required = field.settings.required;
      return props;
    case "pageBreak":
      return props;
    case "sectionBreak":
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.description = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      return props;
    case "photo":
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.description = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.identifier = field?.settings?.identifier
      props.onChange = (photoURL) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: photoURL === "#" ? "#" : photoURL,
          })
        );
      };
      return props;
    case "slider":
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.description = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.min = field.settings.min;
      props.max = field.settings.max;
      props.step = field.settings.step;
      props.value = field.settings.value;
      props.onChange = (e, value) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: value,
          })
        );
      };
      return props;
    case "paragraph":
      props.value = field.settings.value;
      props.required = field.settings.required;
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.helperText = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.onChange = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e.target.value,
          })
        );
      };
      return props;
    case "naYesNo":
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.description = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.images = field.settings.images;
      props.value = field.settings.value;
      props.itemTexts = field.settings.itemTexts;
      props.itemValues = field.settings.itemValues;
      props.required = field.settings.required;
      props.onClick = (e) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: e.currentTarget.value,
          })
        );
      };
      return props;
    case "signature":
      props.label = field.settings.labelI18n[lang]
        ? field.settings.labelI18n[lang]
        : field.settings.labelI18n.English;
      props.description = field.settings.descriptionI18n[lang]
        ? field.settings.descriptionI18n[lang]
        : field.settings.descriptionI18n.English;
      props.value = field.settings.value;
      props.onChange = (value) => {
        store.dispatch(
          action.handleOnChange({
            id: field.id,
            type: field.type,
            value: value,
          })
        );
      };
      return props;
    default:
  }
  return props;
};

const componentMapper = {
  checkboxes: Checkboxes,
  date: DateTime,
  dropdown: Dropdown,
  number: NumberText,
  multipleChoice: SingleChoice,
  singleLine: SingleLine,
  yesNo: YesNo,
  staticText: StaticText,
  pageBreak: PageBreak,
  sectionBreak: SectionBreak,
  photo: Photo,
  slider: Slider,
  paragraph: Paragraph,
  naYesNo: NaYesNo,
  signature: Signature,
};

export const componentGenerator = (field, props) => {
  if (typeof componentMapper[field.type] !== "undefined") {
    return React.createElement(componentMapper[field.type], props);
  }

  return React.createElement(
    () => <div>The component {field.type} has not been created yet.</div>,
    props
  );
};

export const changeValue = (state, data) => {
  const param = state.currentTemplateParams;

  // documentNo +
  //   "-" +
  //   documentPart +
  //   "-" +
  //   activityNo +
  //   "-" +
  //   productFamily +
  //   "-" +
  //   productLine +
  //   "-" +
  //   language;

  const fields =
    state[
      param.documentNo +
        "-" +
        param.documentPart +
        "-" +
        param.activityNo +
        "-" +
        param.productFamily +
        "-" +
        param.productLine +
        "-" +
        param.language
    ].fields;

  for (let i = 0; i < fields.length; i++) {
    if (data.id === fields[i].id) {
      switch (fields[i].type) {
        case "singleLine":
          fields[i].settings.value = data.value;
          break;
        case "yesNo":
          fields[i].settings.value = data.value;
          break;
        case "photo":
          fields[i].settings.value = data.value;
          break;
        case "slider":
          fields[i].settings.value = data.value;
          break;
        case "paragraph":
          fields[i].settings.value = data.value;
          break;
        case "naYesNo":
          fields[i].settings.value = data.value;
          break;
        case "date":
          fields[i].settings.value = data.value;
          break;
        case "number":
          fields[i].settings.value = data.value;
          break;
        case "signature":
          fields[i].settings.value = data.value;
          break;
        case "multipleChoice":
          fields[i].settings.value = data.value;
          break;
        case "checkboxes":
          fields[i].settings.value = data.value;
          break;
        case "dropdown":
          fields[i].settings.value = data.value;
          break;
        default:
      }
      return state;
    }
  }
};

const ops = {
  isString: "==",
  isNotString: "!=",
  isNumber: "==",
  isNotNumber: "!=",
  isOption: "==",
  isNotOption: "!=",
  isBool: "==",
  isExtBool: "==",
  isNotExtBool: "!=",
  isDate: "==",
  isNotDate: "!=",
  before: "==", // TODO: below need handle
  after: "==",
  startsWith: "==",
  endsWith: "==",
  greaterThan: "==",
  lessThan: "==",
  containsString: "!=",
  containsOption: "==",
  doesNotContainString: "!=",
  doesNotContainOption: "==",
  and: "&&",
  or: "||",
};

export const isVisible = (field) => {
  let res = true;

  const param = store.getState().templateForm?.currentTemplateParams;
  if (!param) return res;
  const templateForm =
    store.getState().templateForm[
      param.documentNo +
        "-" +
        param.documentPart +
        "-" +
        param.activityNo +
        "-" +
        param.productFamily +
        "-" +
        param.productLine +
        "-" +
        param.language
    ];

  const fields = templateForm?.fields;

  for (
    let rulesIndex = 0;
    rulesIndex < field.settings.visRules.length;
    rulesIndex++
  ) {
    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      if (
        fields[fieldIndex].id === field.settings.visRules[rulesIndex].fieldId
      ) {
        /*eslint no-eval: 0*/
        let result;
        if (fields[fieldIndex].type === "naYesNo") {
          let value;
          if (fields[fieldIndex].settings.value === "yes") {
            value = "true";
          } else if (fields[fieldIndex].settings.value === "no") {
            value = "false";
          } else {
            value = fields[fieldIndex].settings.value;
          }
          result = JSON.stringify(value);
        } else {
          result = JSON.stringify(fields[fieldIndex].settings.value);
        }

        const cond = eval(
          result +
            ops[field.settings.visRules[rulesIndex].operatorId] +
            JSON.stringify(field.settings.visRules[rulesIndex].argument)
        );

        /*eslint no-eval: 0*/
        res = eval(
          JSON.stringify(res) +
            ops[field.settings.visRules[rulesIndex].conjunctionOperator] +
            JSON.stringify(cond)
        );
        break;
      }
    }
  }

  return res;
};

export const tmplLangMapper = {
  EN: "English",
  ZH: "Chinese",
};
