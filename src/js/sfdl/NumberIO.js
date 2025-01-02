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

export default {
  serialize(doc, findField, parentNode, field) {
    const {
      min,
      max,
      unit,
      unitFront,
      prefilledAnswer,
      value,
    } = field.settings;

    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "decimal",
      field
    );
    appendChild(doc, questionBlock, "numberfield", null, {
      unit,
      "unit-in-front": unitFront,
      min,
      max,
      "prefilled-answer": prefilledAnswer,
      value,
    });
  },

  canDeserialize(node) {
    return (
      node.nodeName === "question_block" && hasChildNode(node, "numberfield")
    );
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "number", "decimal"); // eslint-disable-line prefer-const
    field.settings.required = getRequiredAttr(node, "required") === "true";

    const inputNode = getChildNode(node, "numberfield");
    field.settings.unit = getAttrWithDefault(inputNode, "unit", "");
    field.settings.unitFront =
      getAttrWithDefault(inputNode, "unit-in-front") === "true";
    field.settings.prefilledAnswer = getAttrWithDefault(
      inputNode,
      "prefilled-answer",
      ""
    );

    field.settings.value = getAttrWithDefault(inputNode, "value", "");

    if (inputNode.textContent && inputNode.textContent.trim() !== "") {
      field.settings.value = Number(inputNode.textContent.trim());
      if (isNaN(field.settings.value)) {
        console.warn(
          "Number field value is not a number: " + inputNode.textContent
        );
      }
    }

    ["min", "max"].forEach((attr) => {
      if (
        inputNode.hasAttribute(attr) &&
        getRequiredAttr(inputNode, attr).trim() !== ""
      ) {
        field.settings[attr] = Number(getAttrWithDefault(inputNode, attr, "0"));
      } else {
        field.settings[attr] = null;
      }
    });

    return field;
  },
};
