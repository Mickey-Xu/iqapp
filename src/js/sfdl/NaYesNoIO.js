/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import {
  appendChild,
  appendQuestionBlock,
  hasChildNode,
  getRequiredAttr,
  readQuestionBlock,
  getChildNode,
  getAttrWithDefault,
} from "./utils/xml";

export default {
  serialize(doc, findField, parentNode, field) {
    const {
      notApplicableOption,
      changeDescription,
      fixedOption,
    } = field.settings;

    // TODO string is probably not the ideal choice for return-type
    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "string",
      field
    );

    appendChild(doc, questionBlock, "na_yes_no", null, {
      "not-applicable-option": notApplicableOption,
      "fixed-option": fixedOption,
      "change-button-description-option": changeDescription
        ? changeDescription
        : "false",
      value: field.settings.value,
      itemTexts: field.settings.itemTexts,
      itemValues: field.settings.itemValues,
    });
  },

  canDeserialize(node) {
    return (
      node.nodeName === "question_block" && hasChildNode(node, "na_yes_no")
    );
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "naYesNo", "string"); // eslint-disable-line prefer-const
    field.settings.required = getRequiredAttr(node, "required") === "true";

    const naYesNoNode = getChildNode(node, "na_yes_no");
    field.settings.notApplicableOption =
      getRequiredAttr(naYesNoNode, "not-applicable-option") === "true";
    field.settings.fixedOption =
      getAttrWithDefault(naYesNoNode, "fixed-option", "false") === "true";
    field.settings.changeDescription =
      getAttrWithDefault(
        naYesNoNode,
        "change-button-description-option",
        "false"
      ) === "true";

    field.settings.value =
      getAttrWithDefault(naYesNoNode, "value", "").trim() || undefined;

    let itemTexts = getAttrWithDefault(naYesNoNode, "itemTexts", "");
    field.settings.itemTexts = itemTexts === "" ? [] : itemTexts.split(",");

    let itemValues = getAttrWithDefault(naYesNoNode, "itemValues", "");
    field.settings.itemValues = itemValues === "" ? [] : itemValues.split(",");

    return field;
  },
};
