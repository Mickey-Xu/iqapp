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
} from "./utils/xml";

export default {
  serialize(doc, findField, parentNode, field) {
    const { initialValue } = field.settings;

    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "boolean",
      field
    );
    questionBlock.setAttribute("value", initialValue);

    appendChild(doc, questionBlock, "checkbox", null, {
      value: field.settings.value,
    });
  },

  canDeserialize(node) {
    return node.nodeName === "question_block" && hasChildNode(node, "checkbox");
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "yesNo", "boolean"); // eslint-disable-line prefer-const

    const checkboxNode = getChildNode(node, "checkbox");
    field.settings.initialValue =
      getRequiredAttr(checkboxNode, "value") === "true";

    return field;
  },
};
