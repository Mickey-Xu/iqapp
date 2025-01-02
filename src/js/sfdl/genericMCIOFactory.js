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
  getChildNodes,
  getRequiredAttr,
  getAttrWithDefault,
  readQuestionBlock,
  getValueAttr,
} from "./utils/xml";
import { FREE_TEXT_VALUE } from "./utils/options";
import uuid from "node-uuid";
import { DEFAULT_LANG } from "./constants/global";

export default function genericMCIOFactory(fieldType, xmlElementName) {
  return {
    serialize(doc, findField, parentNode, field) {
      const { options, includeOther } = field.settings;

      const questionBlock = appendQuestionBlock(
        doc,
        findField,
        parentNode,
        "string",
        field
      );

      const radioGroupOrDropdown = appendChild(
        doc,
        questionBlock,
        xmlElementName
      );

      options.forEach(({ id, nameI18n, value }) => {
        const optionNode = appendChild(
          doc,
          radioGroupOrDropdown,
          "option",
          null,
          {
            value: value,
            selected: value === field.settings.value,
          }
        );

        Object.keys(nameI18n).forEach((lang) => {
          if (typeof nameI18n[lang] !== "undefined") {
            appendChild(doc, optionNode, "text", nameI18n[lang], { lang });
          }
        });
      });

      if (includeOther) {
        const optionNode = appendChild(
          doc,
          radioGroupOrDropdown,
          "option",
          null,
          {
            value: FREE_TEXT_VALUE,
            selected: false,
          }
        );
        appendChild(doc, optionNode, "textfield");
      }
    },

    canDeserialize(node) {
      return (
        node.nodeName === "question_block" && hasChildNode(node, xmlElementName)
      );
    },

    deserialize(node) {
      let field = readQuestionBlock(node, fieldType, "string"); // eslint-disable-line prefer-const
      field.settings.required = getRequiredAttr(node, "required") === "true";

      field.settings.value = getValueAttr(node, "value");

      const radioOrDropdownNode = getChildNode(node, xmlElementName);
      const optionNodes = getChildNodes(radioOrDropdownNode, "option");

      let options = []; // eslint-disable-line prefer-const
      field.settings.options = options;

      field.settings.selectedId = null;
      field.settings.includeOther = false;

      optionNodes.forEach((optionNode) => {
        if (hasChildNode(optionNode, "textfield")) {
          const otherTextFieldNode = getChildNode(optionNode, "textfield");
          field.settings.includeOther = true;
          field.settings.otherOptionText = otherTextFieldNode.textContent;
          field.settings.otherOptionSelected =
            getAttrWithDefault(optionNode, "selected", "false") === "true";
        } else {
          const optionId = uuid.v4();

          const nameI18n = getChildNodes(optionNode, "text").reduce(
            (acc, textNode) => {
              return Object.assign({}, acc, {
                [getAttrWithDefault(
                  textNode,
                  "lang",
                  DEFAULT_LANG
                )]: textNode.textContent,
              });
            },
            {}
          );

          options.push({
            id: optionId,
            nameI18n: nameI18n,
            value: getRequiredAttr(optionNode, "value"),
          });

          if (getAttrWithDefault(optionNode, "selected", "false") === "true") {
            field.settings.selectedId = optionId;
          }
        }
      });

      if (field.settings.otherOptionSelected) {
        field.settings.selectedId = null;
      }

      return field;
    },
  };
}
