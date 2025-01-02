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
    // const { settings } = field;
    // const { prefilledAnswer } = settings;

    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "string",
      field
    );
    // appendChild(doc, questionBlock, "textarea", null, {
    //   "prefilled-answer": prefilledAnswer,
    // });

    appendChild(doc, questionBlock, "textarea", field.settings.value);
  },

  canDeserialize(node) {
    return node.nodeName === "question_block" && hasChildNode(node, "textarea");
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "paragraph", "string"); // eslint-disable-line prefer-const
    field.settings.required = getRequiredAttr(node, "required") === "true";

    const textAreaNode = getChildNode(node, "textarea");
    field.settings.text = textAreaNode.textContent;
    field.settings.prefilledAnswer = getAttrWithDefault(
      textAreaNode,
      "prefilled-answer",
      ""
    );

    field.settings.value = textAreaNode.textContent;

    return field;
  },
};
