/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import {
  // appendChildWithLineBreak,
  appendChild,
  appendQuestionBlock,
  hasChildNode,
  getChildNode,
  readQuestionBlock,
  getRequiredAttr,
  getAttrWithDefault,
} from "./utils/xml";

export default {
  serialize(doc, findField, parentNode, field) {
    // const { settings } = field;
    // const { prefilledAnswer } = settings;
    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "string",
      field
    );

    // appendChildWithLineBreak(doc, questionBlock, "textfield", null, {
    //   "prefilled-answer": prefilledAnswer,
    // });

    appendChild(doc, questionBlock, "textfield", field.settings.value);
  },

  canDeserialize(node) {
    return (
      node.nodeName === "question_block" && hasChildNode(node, "textfield")
    );
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "singleLine", "string"); // eslint-disable-line prefer-const
    field.settings.required = getRequiredAttr(node, "required") === "true";

    const textFieldNode = getChildNode(node, "textfield");
    field.settings.text = textFieldNode.textContent;
    field.settings.prefilledAnswer = getAttrWithDefault(
      textFieldNode,
      "prefilled-answer",
      ""
    );

    field.settings.value = textFieldNode.textContent;

    return field;
  },
};
