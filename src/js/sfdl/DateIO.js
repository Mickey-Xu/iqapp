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
  getChildNode,
  getRequiredAttr,
  getAttrWithDefault,
  readQuestionBlock,
} from "./utils/xml";
import moment from "moment";

export default {
  serialize(doc, findField, parentNode, field) {
    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "date",
      field
    );
    const {
      includeTime,
      pastDateNotAllowed,
      futureDateNotAllowed,
      changeNotAllowed,
      hasDefaultValue,
      //   defaultValue,
      value,
    } = field.settings;

    var attr = {
      "past-date-not-allowed": pastDateNotAllowed,
      "future-date-not-allowed": futureDateNotAllowed,
      "change-not-allowed": changeNotAllowed,
      "has-default-value": hasDefaultValue,
      value: value,
    };

    if (hasDefaultValue) {
      attr["default-value"] = "filleddate";
    }

    appendChild(
      doc,
      questionBlock,
      includeTime ? "datetime" : "date",
      "",
      attr
    );
  },

  canDeserialize(node) {
    return (
      node.nodeName === "question_block" &&
      (hasChildNode(node, "date") || hasChildNode(node, "datetime"))
    );
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "date", "date"); // eslint-disable-line prefer-const
    field.settings.required = getRequiredAttr(node, "required") === "true";

    const includeTime = hasChildNode(node, "datetime");
    field.settings.includeTime = includeTime;

    const dateNode = getChildNode(node, includeTime ? "datetime" : "date");

    const dateString = dateNode.textContent;
    if (dateString && dateString.trim() !== "") {
      if (includeTime) {
        field.settings.value = moment(new Date(dateString));
      } else {
        field.settings.value = moment(dateString, "YYYY-MM-DD");
      }
    }

    field.settings.pastDateNotAllowed =
      getAttrWithDefault(dateNode, "past-date-not-allowed", "false") === "true";
    field.settings.futureDateNotAllowed =
      getAttrWithDefault(dateNode, "future-date-not-allowed", "false") ===
      "true";
    field.settings.changeNotAllowed =
      getAttrWithDefault(dateNode, "change-not-allowed", "false") === "true";
    field.settings.hasDefaultValue =
      getAttrWithDefault(dateNode, "has-default-value", "false") === "true";

    field.settings.value = getAttrWithDefault(dateNode, "value", "");

    return field;
  },
};
