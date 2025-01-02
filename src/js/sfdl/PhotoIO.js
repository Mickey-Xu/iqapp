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
  getRequiredAttr,
  hasChildNode,
  getChildNode,
  readQuestionBlock,
  getAttrWithDefault,
} from "./utils/xml";

export default {
  serialize(doc, findField, parentNode, field) {
    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "binary",
      field
    );
    appendChild(doc, questionBlock, "photo", null, {
      src:
        field.settings.value === "#"
          ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          : field.settings.value,
    });
  },

  canDeserialize(node) {
    return node.nodeName === "question_block" && hasChildNode(node, "photo");
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "photo", "binary"); // eslint-disable-line prefer-const
    field.settings.required = getRequiredAttr(node, "required") === "true";

    const photoNode = getChildNode(node, "photo");
    field.settings.dataUrl =
      getAttrWithDefault(photoNode, "src", "").trim() || undefined;

    field.settings.value =
      getAttrWithDefault(photoNode, "src", "").trim() || undefined;

    return field;
  },
};
