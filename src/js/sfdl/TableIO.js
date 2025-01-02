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
} from "./utils/xml";
import { DEFAULT_LANG } from "./constants/global";
import uuid from "node-uuid";

export default {
  serialize(doc, findField, parentNode, field) {
    const { trs, changeNotAllowed } = field.settings;
    const questionBlock = appendQuestionBlock(
      doc,
      findField,
      parentNode,
      "string[]",
      field
    );
    var attr = { "change-not-allowed": changeNotAllowed };

    const table = appendChild(doc, questionBlock, "table", "", attr);

    trs.forEach((tr) => {
      const trNode = appendChild(doc, table, "tr");

      tr.tds.forEach((td) => {
        var attr = tr.columnHeader ? { width: td.width } : {};
        const tdNode = appendChild(doc, trNode, "td", "", attr);
        if (
          tr.columnHeader === true ||
          td.rowHeader === true ||
          changeNotAllowed
        ) {
          Object.keys(td.nameI18n).forEach((lang) => {
            if (typeof td.nameI18n[lang] !== "undefined") {
              appendChild(doc, tdNode, "text", td.nameI18n[lang], { lang });
            }
          });
        } else {
          appendChild(doc, tdNode, "textfield", td.name);
        }
      });
    });
  },

  canDeserialize(node) {
    return node.nodeName === "question_block" && hasChildNode(node, "table");
  },

  deserialize(node) {
    let field = readQuestionBlock(node, "table", "string[]"); // eslint-disable-line prefer-const

    const tableNode = getChildNode(node, "table");
    const trNodes = getChildNodes(tableNode, "tr");
    const changeNotAllowed =
      getAttrWithDefault(tableNode, "change-not-allowed", "false") === "true";
    let trs = []; // eslint-disable-line prefer-const
    field.settings.trs = trs;
    field.settings.required = getRequiredAttr(node, "required") === "true";

    trNodes.forEach((trNode, trIndex) => {
      const trId = uuid.v4();
      let tds = [];
      if (trIndex === 0) {
        trs.push({
          id: trId,
          columnHeader: true,
          tds: tds,
        });
      } else {
        trs.push({
          id: trId,
          tds: tds,
        });
      }
      const tdNodes = getChildNodes(trNode, "td");

      tdNodes.forEach((tdNode, tdIndex) => {
        const tdId = uuid.v4();
        trs[trIndex].tds.push({
          id: tdId,
        });

        if (trIndex === 0) {
          const nameI18n = getChildNodes(tdNode, "text").reduce(
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
          trs[trIndex].tds[tdIndex].nameI18n = nameI18n;
          trs[trIndex].tds[tdIndex].width = getAttrWithDefault(
            tdNode,
            "width",
            0
          );
        } else if (tdIndex === 0) {
          trs[trIndex].tds[tdIndex].rowHeader = true;
          const nameI18n = getChildNodes(tdNode, "text").reduce(
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
          trs[trIndex].tds[tdIndex].nameI18n = nameI18n;
        } else if (changeNotAllowed) {
          const contentNode = getChildNode(tdNode, "textfield");
          let nameI18n = {};
          if (contentNode.hasAttribute("lang")) {
            nameI18n = getChildNodes(tdNode, "text").reduce((acc, textNode) => {
              return Object.assign({}, acc, {
                [getAttrWithDefault(
                  textNode,
                  "lang",
                  DEFAULT_LANG
                )]: textNode.textContent,
              });
            }, {});
          } else {
            //Compatible with older versions
            nameI18n[DEFAULT_LANG] =
              contentNode.textContent !== "" &&
              contentNode.textContent !== undefined
                ? contentNode.textContent
                : undefined;
          }
          trs[trIndex].tds[tdIndex].nameI18n = nameI18n;
        } else {
          const contentNode = getChildNode(tdNode, "textfield");
          var nameI18n = {};
          nameI18n[DEFAULT_LANG] =
            contentNode.textContent !== "" &&
            contentNode.textContent !== undefined
              ? contentNode.textContent
              : undefined;
          trs[trIndex].tds[tdIndex].nameI18n = nameI18n;
        }
      });
    });

    field.settings.changeNotAllowed = changeNotAllowed;

    return field;
  },
};
