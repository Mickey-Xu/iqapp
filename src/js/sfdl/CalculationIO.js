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
  readQuestionBlock,
  getAttrWithDefault,
} from "./utils/xml";

export default {
  serialize(doc, findField, parentNode, field) {
    const { formula } = field.settings;

    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "decimal",
      field
    );
    appendChild(doc, questionBlock, "calculation", null, {
      formula: formula || "0",
    });
  },

  canDeserialize(node) {
    return (
      node.nodeName === "question_block" && hasChildNode(node, "calculation")
    );
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "calculation", "decimal"); // eslint-disable-line prefer-const

    const calculationNode = getChildNode(node, "calculation");
    field.settings.formula = getRequiredAttr(calculationNode, "formula");

    const value = parseFloat(getAttrWithDefault(node, "value", ""));
    if (!Number.isNaN(value)) {
      field.settings.value = value;
    }

    return field;
  },
};
