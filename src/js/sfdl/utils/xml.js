/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import Ops from "../constants/VisibilityOperators";
import uuid from "node-uuid";
import assert from "assert";
import { DEFAULT_LANG } from "../constants/global";
import { FREE_TEXT_VALUE } from "../utils/options";
import _ from "lodash";
import moment from "moment";
import serialize from "../serialize";

export function readQuestionBlock(node, type, expectedReturnType) {
  if (getRequiredAttr(node, "return-type") !== expectedReturnType) {
    throw new Error(`return-type of ${type} is not ${expectedReturnType}`);
  }

  const questionNode = getChildNode(node, "question");

  const labelI18n = getChildNodes(questionNode, "text").reduce(
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

  const descriptionI18n = {
    [DEFAULT_LANG]: getAttrWithDefault(questionNode, "description", undefined),
  };

  getChildNodes(questionNode, "description").forEach((descriptionNode) => {
    descriptionI18n[getRequiredAttr(descriptionNode, "lang")] =
      descriptionNode.textContent;
  });

  const annotatable = hasChildNode(node, "annotation");
  let annotation = null;

  if (annotatable) {
    const annotationNode = getChildNode(node, "annotation");

    const text = getChildNodes(annotationNode, "text")
      .map((n) => n.textContent)
      .join(" ");
    const imageUrl = hasChildNode(annotationNode, "image")
      ? getRequiredAttr(getChildNode(annotationNode, "image"), "src")
      : null;

    if (text || imageUrl) {
      annotation = { text, imageUrl };
    }
  }

  const tags = _.uniq(
    getAttrWithDefault(node, "tags", "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
  );

  return {
    id: getAttrWithDefault(node, "guid", uuid.v4()),
    type: type,
    annotation,
    tags,
    settings: {
      identifier: getRequiredAttr(node, "identifier"),
      labelI18n: labelI18n,
      important: getRequiredAttr(node, "important") === "true",
      annotatable: annotatable,
      descriptionI18n: descriptionI18n,
      images: readImages(questionNode),
    },
  };
}

export function readImages(questionNode) {
  return getChildNodes(questionNode, "image").map((n) => ({
    id: uuid.v4(),
    url: getRequiredAttr(n, "src"),
  }));
}

export function getAttrWithDefault(node, attrName, defaultValue) {
  if (node.hasAttribute(attrName)) {
    return node.getAttribute(attrName);
  } else {
    return defaultValue;
  }
}

export function getRequiredAttr(node, attrName) {
  if (node.hasAttribute(attrName)) {
    return node.getAttribute(attrName);
  } else {
    throw new Error(
      `Expected "${node.nodeName}" element to have an attribute "${attrName}"`
    );
  }
}

export function getValueAttr(node, attrName) {
  if (node.hasAttribute(attrName)) {
    return node.getAttribute(attrName);
  } else {
    return "";
  }
}

export function hasChildNode(node, childName) {
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];
      if (child.nodeName === childName) {
        return true;
      }
    }
  }

  return false;
}

export function getChildNode(node, childName) {
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];
      if (child.nodeName === childName) {
        return child;
      }
    }
  }

  throw new Error(
    `Expected element "${node.nodeName}" to have a "${childName}" child element.`
  );
}

export function getChildNodes(node, childName) {
  let result = []; // eslint-disable-line prefer-const

  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];
      if (child.nodeName === childName) {
        result.push(child);
      }
    }
  }

  return result;
}

export function appendChild(
  doc,
  parentNode,
  name,
  textContent = "",
  attributes = {},
  isTextContentEncode = true
) {
  const node = doc.createElement(name);
  parentNode.appendChild(node);

  Object.keys(attributes).forEach((key) => {
    let value = attributes[key];
    if (value !== null) {
      if (typeof value === "string") {
        value = value.replace("\n", " ");
      }
      node.setAttribute(key, value);
    }
  });

  // TODO check how newlines are handled, that is, are they still there when the sfdl is imported?
  if (textContent) {
    if (isTextContentEncode)
      node.appendChild(
        doc.createTextNode(
          decodeURIComponent(
            encodeURIComponent(textContent).split("%C2%AD").join("")
          )
        )
      );
    else node.appendChild(doc.createTextNode(textContent));
  }

  return node;
}

export function appendChildWithLineBreak(
  doc,
  parentNode,
  name,
  textContent = "",
  attributes = {}
) {
  const node = doc.createElement(name);
  parentNode.appendChild(node);

  Object.keys(attributes).forEach((key) => {
    let value = attributes[key];
    if (value !== null) {
      node.setAttribute(key, value);
    }
  });

  // TODO check how newlines are handled, that is, are they still there when the sfdl is imported?
  if (textContent) {
    const textNode = doc.createTextNode(
      decodeURIComponent(
        encodeURIComponent(textContent).split("%C2%AD").join("")
      )
    );
    node.appendChild(textNode);
  }

  return node;
}

export function appendQuestionBlock(
  doc,
  findField,
  parentNode,
  returnType,
  field
) {
  const { id, settings } = field;
  const {
    identifier,
    labelI18n,
    important,
    annotatable,
    descriptionI18n,
    visRules,
    images,
    authorizationRules,
    tagRules,
    printTagRules,
    buttonDescriptions,
    externalVisRules,
    value,
    // value,
  } = settings;
  const required = settings.hasOwnProperty("required")
    ? settings.required
    : false;

  let initValue = "";

  if (value) {
    if (value.includes(",")) {
      initValue = value.split(",");
    } else {
      initValue = value;
    }
  } else {
    initValue = "";
  }

  const questionBlock = appendChild(doc, parentNode, "question_block", null, {
    guid: id,
    identifier: identifier,
    required: required,
    important: important,
    "return-type": returnType,
    value: initValue,
  });

  if (annotatable) {
    appendChild(doc, questionBlock, "annotation");
  }

  appendVisRules(doc, findField, questionBlock, visRules);
  appendExtVisRules(doc, findField, questionBlock, externalVisRules);
  appendAuthorizationRules(doc, questionBlock, field, authorizationRules);
  appendTagRules(doc, questionBlock, field, tagRules);
  appendPrintTagRules(doc, questionBlock, field, printTagRules);
  appendButtonDescriptions(doc, questionBlock, buttonDescriptions);

  const questionNode = appendChild(doc, questionBlock, "question");

  Object.keys(labelI18n).forEach((lang) => {
    if (typeof labelI18n[lang] !== "undefined") {
      appendChild(doc, questionNode, "text", labelI18n[lang], { lang });
    }
  });

  Object.keys(descriptionI18n).forEach((lang) => {
    if (typeof descriptionI18n[lang] !== "undefined") {
      appendChild(doc, questionNode, "description", descriptionI18n[lang], {
        lang,
      });
    }
  });

  appendImages(doc, questionNode, images);

  return questionBlock;
}

export function appendStaticTagRules(doc, parentNode, field, tagRules) {
  if (tagRules && tagRules.length > 0) {
    const tagRulesNode = appendChild(doc, parentNode, "tag_rules");

    tagRules.forEach(({ tagName, operatorId, argument, alwaysAdd }) => {
      assert(tagName); // this must be added earlier in the serialization process

      appendChild(doc, tagRulesNode, "tag", null, { name: tagName });
    });
  }
}

export function appendImages(doc, parentNode, images) {
  images.forEach(({ url }) => {
    appendChild(doc, parentNode, "image", null, { src: url });
  });
}

export function appendVisRules(doc, findField, parentNode, visRules) {
  if (Array.isArray(visRules)) {
    if (visRules.length > 0) {
      // const first = visRules[0];
      const visRulesNode = appendChild(
        doc,
        parentNode,
        "visibility_rules",
        null
      );

      visRules.forEach((child) => {
        appendVisRules(doc, findField, visRulesNode, child);
      });
    }
  } else {
    const {
      fieldId,
      operatorId,
      argument,
      conjunctionOperator,
      positionRule,
    } = visRules;
    const field = findField(fieldId);
    const { settings } = field;

    assert(typeof settings.identifier === "string");

    appendChild(doc, parentNode, "condition", null, {
      "field-identifier": settings.identifier,
      operator: operatorId,
      "conjunction-operator": conjunctionOperator,
      argument: ruleArgumentToString(field, operatorId, argument),
      positionRule: positionRule,
    });
  }
}

export function appendTagRules(doc, parentNode, field, tagRules) {
  if (tagRules && tagRules.length > 0) {
    const tagRulesNode = appendChild(doc, parentNode, "tag_rules");

    tagRules.forEach(({ tagName, operatorId, argument, alwaysAdd }) => {
      assert(tagName); // this must be added earlier in the serialization process

      if (alwaysAdd) {
        appendChild(doc, tagRulesNode, "tag", null, { name: tagName });
      } else {
        argument = ruleArgumentToString(field, operatorId, argument);

        appendChild(doc, tagRulesNode, "tag_rule", null, {
          tag: tagName,
          operator: operatorId,
          argument: argument,
        });
      }
    });
  }
}

export function appendPrintTagRules(doc, parentNode, field, printTagRules) {
  if (printTagRules && printTagRules.length > 0) {
    const printTagRulesNode = appendChild(doc, parentNode, "print_tag_rules");

    printTagRules.forEach(({ tagName }) => {
      appendChild(doc, printTagRulesNode, "tag", null, { name: tagName });
    });
  }
}

export function appendAuthorizationRules(
  doc,
  parentNode,
  field,
  authorizationRules
) {
  if (authorizationRules && authorizationRules.length > 0) {
    const authorizationRulesNode = appendChild(
      doc,
      parentNode,
      "authorization_rules"
    );

    authorizationRules.forEach(({ authorizationName }) => {
      appendChild(doc, authorizationRulesNode, "authorization", null, {
        name: authorizationName,
      });
    });
  }
}

export function ruleArgumentToString(field, operatorId, argument) {
  const argType = Ops[operatorId].argType;
  const { settings } = field;

  if (argType === "optionId" && argument !== FREE_TEXT_VALUE) {
    const { options } = settings;
    const option = options.find((o) => o.value === argument);
    argument = option.value;
  }

  if (argType === "date") {
    assert(moment.isMoment(argument));
    argument = argument.format("YYYY-MM-DD");
  }

  return argument;
}

export function appendExtVisRules(
  doc,
  findField,
  parentNode,
  externalVisRules
) {
  if (externalVisRules) {
    if (Array.isArray(externalVisRules)) {
      if (externalVisRules.length > 0) {
        // const first = externalVisRules[0];
        const extVisRulesNode = appendChild(
          doc,
          parentNode,
          "external_visibility_rules",
          null
        );

        externalVisRules.forEach((child) => {
          appendExtVisRules(doc, findField, extVisRulesNode, child);
        });
      }
    } else {
      const {
        fieldId,
        operatorId,
        argument,
        conjunctionOperator,
        fields,
        form,
        positionRule,
      } = externalVisRules;
      const field = fields.find((f) => f.id === fieldId);
      const { settings } = field;

      assert(typeof settings.identifier === "string");

      const extConditionNode = appendChild(doc, parentNode, "condition", null, {
        "field-identifier": settings.identifier,
        operator: operatorId,
        "conjunction-operator": conjunctionOperator,
        argument: ruleArgumentToString(field, operatorId, argument),
        positionRule: positionRule,
      });
      const externalForm = serialize(form, fields);
      appendChild(
        doc,
        extConditionNode,
        "external_form",
        externalForm,
        {},
        false
      );
    }
  }
}

export function appendButtonDescriptions(doc, parentNode, buttonDescriptions) {
  if (buttonDescriptions && buttonDescriptions.length > 0) {
    const buttonDescriptionsNode = appendChild(
      doc,
      parentNode,
      "button_descriptions"
    );

    buttonDescriptions.forEach(
      ({ selectedDescriptionId, selectedButtonId }) => {
        appendChild(doc, buttonDescriptionsNode, "button_description", null, {
          "selected-description-id": selectedDescriptionId,
          "selected-button-id": selectedButtonId,
        });
      }
    );
  }
}

export function appendValue(doc, parentNode, value) {
  if (value && value.length > 0) {
    appendChild(doc, parentNode, "value", value);
  }
}
