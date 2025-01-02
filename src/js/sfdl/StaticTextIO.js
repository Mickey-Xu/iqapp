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
  appendVisRules,
  appendStaticTagRules,
  appendImages,
  getChildNodes,
  getRequiredAttr,
  readImages,
  getAttrWithDefault,
  appendPrintTagRules,
  appendAuthorizationRules,
  appendExtVisRules,
} from "./utils/xml";
import uuid from "node-uuid";
import { DEFAULT_LANG } from "./constants/global";

export default {
  serialize(doc, findField, parentNode, field) {
    const { id } = field;
    const {
      identifier,
      textI18n,
      important,
      visRules,
      images,
      authorizationRules,
      tagRules,
      printTagRules,
      externalVisRules,
    } = field.settings;

    const labelNode = appendChild(doc, parentNode, "label", null, {
      guid: id,
      identifier: identifier,
      important,
    });

    Object.keys(textI18n).forEach((lang) => {
      if (typeof textI18n[lang] !== "undefined") {
        appendChild(doc, labelNode, "text", textI18n[lang], { lang });
      }
    });

    appendVisRules(doc, findField, labelNode, visRules);
    appendExtVisRules(doc, findField, labelNode, externalVisRules);
    appendImages(doc, labelNode, images);
    appendAuthorizationRules(doc, labelNode, field, authorizationRules);
    appendStaticTagRules(doc, labelNode, field, tagRules);
    appendPrintTagRules(doc, labelNode, field, printTagRules);
  },

  canDeserialize(node) {
    return node.nodeName === "label";
  },

  deserialize(node) {
    const textI18n = getChildNodes(node, "text").reduce((acc, textNode) => {
      return Object.assign({}, acc, {
        [getAttrWithDefault(
          textNode,
          "lang",
          DEFAULT_LANG
        )]: textNode.textContent,
      });
    }, {});

    return {
      id: getAttrWithDefault(node, "guid", uuid.v4()),
      type: "staticText",
      settings: {
        identifier: getAttrWithDefault(node, "identifier", uuid.v4()),
        textI18n: textI18n,
        important: getRequiredAttr(node, "important") === "true",
        images: readImages(node),
      },
    };
  },
};
