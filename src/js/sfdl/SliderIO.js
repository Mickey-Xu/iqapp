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
  readQuestionBlock,
  getRequiredAttr,
  getChildNode,
  getAttrWithDefault,
} from "./utils/xml";

export default {
  serialize(doc, findField, parentNode, field) {
    const { min, max, step, initialValue, value } = field.settings;

    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "decimal",
      field
    );
    questionBlock.setAttribute("value", initialValue);

    appendChild(doc, questionBlock, "range", null, {
      from: min,
      to: max,
      step: step,
      value,
    });
  },

  canDeserialize(node) {
    return node.nodeName === "question_block" && hasChildNode(node, "range");
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "slider", "decimal"); // eslint-disable-line prefer-const

    const rangeNode = getChildNode(node, "range");
    field.settings.min = Number(getRequiredAttr(rangeNode, "from"));
    field.settings.max = Number(getRequiredAttr(rangeNode, "to"));
    field.settings.step = Number(getRequiredAttr(rangeNode, "step"));
    field.settings.initialValue = Number(getRequiredAttr(rangeNode, "value"));

    const value = Number(getAttrWithDefault(node, "value", "x"));
    if (!Number.isNaN(value)) {
      field.settings.value = value;
    }

    return field;
  },
};
