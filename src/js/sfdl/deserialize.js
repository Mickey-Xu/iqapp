import {
  SFDL_VERSION,
  SFDL_MAJOR_VERSION,
  SFDL_MINOR_VERSION,
  XSD_REVISION,
  XSD_VERSION,
  RETURN_TO_APP_URLS,
  DEFAULT_LANG,
} from "./constants/global";
import {
  getRequiredAttr,
  getAttrWithDefault,
  getChildNode,
  getChildNodes,
  hasChildNode,
  readImages,
} from "./utils/xml";
import isValidIdentifier, {
  removeXMLInvalidChars,
} from "./expr/isValidIdentifier";
import FieldTypes from "./constants/FieldTypes";
import uuid from "node-uuid";
import assert from "assert";
import { decrypt } from "./utils/crypto";
import Ops from "./constants/VisibilityOperators";
import moment from "moment";
import { FREE_TEXT_VALUE } from "./utils/options";
import getDefaultValue from "./utils/getDefaultValue";
import setupIO from "./setup";

export default function deserialize(xmlText) {
  // fix cyclic call setupIO caused by recursive
  if (!arguments[1]) {
    setupIO();
  }

  const parser = new DOMParser();
  let form;
  let fields;
  let fieldsVisRules;

  try {
    const docNode = parser.parseFromString(
      removeXMLInvalidChars(xmlText),
      "application/xml"
    ).documentElement;

    if (docNode.nodeName === "form") {
      checkRootNode(docNode);
      checkSfdlVersion(docNode, xmlText);
      checkXsdVersion(docNode, xmlText);

      form = readFormMetadata(docNode); // eslint-disable-line prefer-const
      fields = []; // eslint-disable-line prefer-const
    } else if (docNode.nodeName === "visibility_rules") {
      fieldsVisRules = [];
    }

    if (docNode.hasChildNodes()) {
      let pageIndex = 0;

      // XML sucks
      for (let i = 0; i < docNode.childNodes.length; i += 1) {
        const child = docNode.childNodes[i];
        switch (child.nodeName) {
          case "title":
            form.settings.titleI18n[getRequiredAttr(child, "lang")] =
              child.textContent;
            break;
          case "description":
            form.settings.descriptionI18n[getRequiredAttr(child, "lang")] =
              child.textContent;
            break;
          case "logos":
            readLogos(form, child);
            break;
          case "authorizations":
            readAuthorizationUniverse(form, child);
            break;
          case "tags":
            readTagUniverse(form, child);
            break;
          case "print_tags":
            readPrintTagUniverse(form, child);
            break;
          case "tag_rules_in_filter":
            readTagRulesInFilter(form, child);
            break;
          case "print_settings":
            readPrintSettings(form, child);
            break;
          case "languages":
            readLanguages(form, child);
            break;
          case "email_action":
            readEmailAction(form, child);
            break;
          case "webdav_action":
            readWebdavAction(form, child);
            break;
          case "return_to_app_action":
            readReturnToAppAction(form, child);
            break;
          case "devices":
            readDevices(form, child);
            break;
          case "meta_datas":
            readMetadata(form, child);
            break;
          case "blocks":
            readBuildingBlocks(form, child);
            break;
          case "page":
            readPage(fields, child, pageIndex);
            pageIndex += 1;
            break;
          case "question_visibility_rules":
            // addVisibilityRules(child, fieldsVisRules);
            break;
          case "#comment":
          case "#text":
            // ignore this
            break;
          default:
            throw new Error(
              "Root element contains an illegal child element: " +
                child.nodeName
            );
        }
      }
    }

    if (docNode.nodeName === "form") {
      // Visibility rules:
      fields
        .filter((f) =>
          FieldTypes[f.type].initialSettings.hasOwnProperty("visRules")
        )
        .forEach((field) => {
          field.settings.visRules = readVisRules(fields, field.node);
          //delete field.node;
        });

      // External visibility rules:
      fields
        .filter((f) =>
          FieldTypes[f.type].initialSettings.hasOwnProperty("externalVisRules")
        )
        .forEach((field, position) => {
          field.settings.externalVisRules = readExtVisRules(
            fields,
            field.node,
            position
          );
        });

      // Authorization rules:
      if (form.settings.authorizationUniverse === undefined) {
        form.settings.authorizationUniverse = [];
      }
      const authorizationUniverse = form.settings.authorizationUniverse;
      fields
        .filter((f) =>
          FieldTypes[f.type].initialSettings.hasOwnProperty(
            "authorizationRules"
          )
        )
        .forEach((field) => {
          field.settings.authorizationRules = readAuthorizationRules(
            authorizationUniverse,
            field,
            field.node
          );
          //delete field.node;
        });

      // Tagging rules:
      const tagUniverse = form.settings.tagUniverse;
      fields
        .filter((f) =>
          FieldTypes[f.type].initialSettings.hasOwnProperty("tagRules")
        )
        .forEach((field) => {
          field.settings.tagRules = readTagRules(
            tagUniverse,
            field,
            field.node
          );
          //delete field.node;
        });

      // Print tagging rules:
      const printTagUniverse = form.settings.printTagUniverse;
      fields
        .filter((f) =>
          FieldTypes[f.type].initialSettings.hasOwnProperty("printTagRules")
        )
        .forEach((field) => {
          field.settings.printTagRules = readPrintTagRules(
            printTagUniverse,
            field,
            field.node
          );
          //delete field.node;
        });

      // button descriptions:
      fields
        .filter((f) =>
          FieldTypes[f.type].initialSettings.hasOwnProperty(
            "buttonDescriptions"
          )
        )
        .forEach((field) => {
          field.settings.buttonDescriptions = readButtonDescriptions(
            fields,
            field.node
          );
          //delete field.node;
        });

      return { form, fields };
    } else {
      return { fieldsVisRules };
    }
  } catch (e) {
    return { error: e.message };
  }
}

// some browsers (Chrome, Firefox) does not throw an exception in DOMParser#parseFromString() on
// invalid input but instead just return a document with a parsererror root-node. So check that
// the root-node is indeed a nice form-element
function checkRootNode(docNode) {
  if (docNode.nodeName !== "form" && docNode.nodeName !== "visibility_rules") {
    throw new Error("This doesn't even look like a valid SFDL document!");
  }
}

function checkSfdlVersion(docNode, xmlText) {
  const version = getRequiredAttr(docNode, "version");
  const versionParts = version.split(".");
  const major = Number(versionParts[0]);
  const minor = Number(versionParts[1]);

  if (major !== SFDL_MAJOR_VERSION || minor > SFDL_MINOR_VERSION) {
    var stylesheet = determineTransformStylesheet(
      major,
      minor,
      SFDL_MAJOR_VERSION,
      SFDL_MINOR_VERSION
    );

    if (stylesheet) {
      docNode = transformSfdlVersion(docNode, stylesheet, xmlText);
    } else {
      throw new Error(
        `This document is in SFDL format version ${version} but FormBuilder uses ` +
          `version ${SFDL_VERSION}. Please try to upgrade the version of FormBuilder you are ` +
          `using, or ask your IT-administrator to convert the form for you.`
      );
    }
  }
}

// xsd-version reflects all changes happened on the xml schema
// while sfdl only reflects big changes
function checkXsdVersion(docNode, xmlText) {
  const xsdVersion = getAttrWithDefault(docNode, "xsd-version", "");

  if (xsdVersion.length === 0) {
    return;
  } // old version

  const versionParts = xsdVersion.split(".");
  const major = Number(versionParts[0]);
  const minor = Number(versionParts[1]);
  const revision = Number(versionParts[2]);

  if (
    major > SFDL_MAJOR_VERSION ||
    minor > SFDL_MINOR_VERSION ||
    revision > XSD_REVISION
  ) {
    throw new Error(
      `This document is in SFDL format version ${xsdVersion} but FormBuilder uses ` +
        `version ${XSD_VERSION}. Please try to upgrade the version of FormBuilder you are ` +
        `using, or ask your IT-administrator to convert the form for you.`
    );
  }
}

function determineTransformStylesheet(
  sourceMajor,
  sourceMinor,
  destMajor,
  destMinor
) {
  var stylesheet = {};

  stylesheet["xslt10to20.xslt"] =
    '<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="@title" /><xsl:template match="@description" /><xsl:template match="@version" /><xsl:template match="@*|node()"><xsl:copy><xsl:apply-templates select="@*|node()"/></xsl:copy>  </xsl:template><xsl:template match="form">  <xsl:copy><xsl:copy-of select="@version|@identifier|@template-version|@include-geo-location|@instance-id|@geo-location|@send-once"/><xsl:attribute name="version">2.0</xsl:attribute><xsl:choose><xsl:when test="not(@template-version)"><xsl:attribute name="template-version">2.0</xsl:attribute></xsl:when></xsl:choose><title lang="English"><xsl:value-of select="@title" /></title><description lang="English"><xsl:value-of select="@description" /></description><languages><language fallback="true">English</language></languages><xsl:apply-templates select="node()"/></xsl:copy></xsl:template><xsl:template match="question"><xsl:copy> <xsl:apply-templates select="@*|node()"/><description lang="English"><xsl:value-of select="@description" /></description></xsl:copy></xsl:template><xsl:template match="text"><xsl:copy><xsl:attribute name="lang">English</xsl:attribute><xsl:value-of select="text()"/></xsl:copy></xsl:template><xsl:template match="section[@title]|section[@description]"><xsl:copy><xsl:apply-templates select="@important"/><title lang="English"><xsl:value-of select="@title"/></title><description lang="English"><xsl:value-of select="@description"/></description><xsl:apply-templates select="node()"/></xsl:copy></xsl:template></xsl:stylesheet>';

  const key =
    "xslt" + sourceMajor + sourceMinor + "to" + destMajor + destMinor + ".xslt";

  return stylesheet[key];
}

function transformSfdlVersion(docNode, stylesheet, xmlText) {
  const parser = new DOMParser();
  const xsltProcessor = new XSLTProcessor();

  var xsltDoc = parser.parseFromString(stylesheet, "text/xml");
  xsltProcessor.importStylesheet(xsltDoc);

  var newDoc = xsltProcessor.transformToFragment(docNode, document);

  return newDoc;
}

function readFormMetadata(docNode) {
  const [lat, long, latLongAccuracy] = getAttrWithDefault(
    docNode,
    "geo-location",
    ""
  )
    .split(",")
    .filter((s) => s !== "")
    .map((s) => Number(s));

  return {
    id: getAttrWithDefault(docNode, "template-guid", uuid.v4()),
    instanceId:
      getAttrWithDefault(docNode, "instance-id", undefined) || undefined,
    templateVersion: getAttrWithDefault(docNode, "template-version", "1.0"),
    lat,
    long,
    latLongAccuracy,
    history: [],
    languages: [DEFAULT_LANG],
    fallbackLang: DEFAULT_LANG,
    settings: {
      identifier: getRequiredAttr(docNode, "identifier"),
      xsdVersion: getAttrWithDefault(docNode, "xsd-version", ""),
      status: getAttrWithDefault(docNode, "status", "unknown"),
      globalTemplate: getAttrWithDefault(docNode, "global-template", "0"),
      titleI18n: {
        [DEFAULT_LANG]: getAttrWithDefault(docNode, "title", undefined),
      },
      descriptionI18n: {
        [DEFAULT_LANG]: getAttrWithDefault(docNode, "description", undefined),
      },
      includeGeoLocation:
        getRequiredAttr(docNode, "include-geo-location") === "true",
      sendOnce: getAttrWithDefault(docNode, "send-once", "false") === "true",
      forceSaveMultiLanguage:
        getAttrWithDefault(docNode, "force-save-multi-language", "false") ===
        "true",
      tagUniverse: [],
      printTagUniverse: [],
      tagRulesInFilter: "0",
      emailAction: {
        selected: false,
        receivers: [],
        attachmentType: "",
      },
      returnToApp: {
        selected: false,
        appId: RETURN_TO_APP_URLS[0],
      },
      webDavAction: {
        selected: false,
        server: "",
        path: "",
        username: "",
        password: "",
      },
      metadata: [],
      blocks: [],
      logos: [],
      kgCode: getAttrWithDefault(docNode, "kg-code", ""),
      maxNumberOfPictures: getAttrWithDefault(
        docNode,
        "max-number-of-pictures",
        "10"
      ),
      printSettings: {
        printHeader: false,
        headerText: "",
        printFooter: false,
        footerText: "",
      },
    },
  };
}

function readLogos(form, logosNode) {
  form.settings.logos = readImages(logosNode);
}

function readAuthorizationUniverse(form, authorizationsNode) {
  form.settings.authorizationUniverse = getChildNodes(
    authorizationsNode,
    "authorization"
  )
    .map((authorizationNode) => getRequiredAttr(authorizationNode, "name"))
    .filter((authorization) => isValidIdentifier(authorization))
    .map((authorization) => ({
      id: uuid.v4(),
      name: authorization,
    }));
}

function readTagUniverse(form, tagsNode) {
  form.settings.tagUniverse = getChildNodes(tagsNode, "tag")
    .map((tagNode) => getRequiredAttr(tagNode, "name"))
    .filter((tag) => isValidIdentifier(tag))
    .map((tag) => ({
      id: uuid.v4(),
      name: tag,
    }));
}

function readPrintTagUniverse(form, tagsNode) {
  form.settings.printTagUniverse = getChildNodes(tagsNode, "tag")
    .map((tagNode) => ({
      name: getRequiredAttr(tagNode, "name"),
      excludeFromOutput:
        getAttrWithDefault(tagNode, "exclude-from-output", "false") === "true",
    }))
    .filter(({ name }) => isValidIdentifier(name))
    .map(({ name, excludeFromOutput }) => ({
      id: uuid.v4(),
      name: name,
      excludeFromOutput: excludeFromOutput,
    }));
}

function readTagRulesInFilter(form, tagRulesInFilterNode) {
  form.settings.tagRulesInFilter = tagRulesInFilterNode.textContent;
}

function readPrintSettings(form, printSettingsNode) {
  const { printSettings } = form.settings;

  printSettings.printHeader =
    getAttrWithDefault(printSettingsNode, "header-required", "false") ===
    "true";
  printSettings.printFooter =
    getAttrWithDefault(printSettingsNode, "footer-required", "false") ===
    "true";

  if (hasChildNode(printSettingsNode, "header")) {
    const header = getChildNode(printSettingsNode, "header");
    printSettings.headerText = header.textContent;
  }

  if (hasChildNode(printSettingsNode, "footer")) {
    const footer = getChildNode(printSettingsNode, "footer");
    printSettings.footerText = footer.textContent;
  }
}

function readLanguages(form, languagesNode) {
  form.languages = getChildNodes(languagesNode, "language").map((langNode) =>
    langNode.textContent.trim()
  );

  assert(form.languages.length > 0);

  form.fallbackLang =
    getChildNodes(languagesNode, "language")
      .filter(
        (node) => getAttrWithDefault(node, "fallback", "false") === "true"
      )
      .map((node) => node.textContent.trim())[0] || DEFAULT_LANG;
}

function readEmailAction(form, actionNode) {
  const { emailAction } = form.settings;

  emailAction.selected = true;
  emailAction.receivers = getChildNodes(actionNode, "receiver").map(
    (node) => node.textContent
  );
  emailAction.attachmentType = getAttrWithDefault(
    actionNode,
    "attachment-type",
    "all"
  );
}

function readWebdavAction(form, actionNode) {
  const { webDavAction } = form.settings;

  webDavAction.selected = true;
  ["server", "path", "username", "password"].forEach((attr) => {
    webDavAction[attr] = decrypt(getChildNode(actionNode, attr).textContent);
  });

  var fileType = "";
  try {
    fileType = getChildNode(actionNode, "file-type").textContent;
  } catch (error) {
    console.log(error);
  }

  if (!fileType || fileType.length === 0) {
    fileType = "xml";
  }
  webDavAction.fileType = fileType;
}

function readReturnToAppAction(form, actionNode) {
  const { returnToApp } = form.settings;

  returnToApp.selected = true;
  returnToApp.appId = getChildNode(actionNode, "app_url").textContent;
}

function readDevices(form, devicesNode) {
  form.history = getChildNodes(devicesNode, "device").map((devNode) => ({
    exportAction: getRequiredAttr(devNode, "export-action"),
    exportDate: new Date(getRequiredAttr(devNode, "export-date")),
    deviceId: devNode.textContent,
  }));
}

function readMetadata(form, metadataNode) {
  form.settings.metadata = getChildNodes(metadataNode, "meta_data").map(
    (item) => {
      return {
        key: getRequiredAttr(item, "key"),
        value: getRequiredAttr(item, "value"),
      };
    }
  );
}

function readBuildingBlocks(form, blocksNode) {
  form.settings.blocks = getChildNodes(blocksNode, "block").map(
    (blockNode) => ({
      guid: getRequiredAttr(blockNode, "guid"),
      identifier: getRequiredAttr(blockNode, "identifier"),
      title: getRequiredAttr(blockNode, "title"),
      src: getRequiredAttr(blockNode, "src"),
      fields: getChildNodes(blockNode, "field").map((fieldNode) =>
        getRequiredAttr(fieldNode, "guid")
      ),
    })
  );
}

function readPage(fields, pageNode, pageIndex) {
  let pageField = null;

  if (
    pageIndex !== 0 ||
    hasChildNode(pageNode, "title") ||
    pageNode.hasAttribute("title")
  ) {
    pageField = {
      id: getAttrWithDefault(pageNode, "guid", uuid.v4()),
      type: "pageBreak",
      settings: {
        identifier: getAttrWithDefault(pageNode, "identifier", ""),
        labelI18n: {
          [DEFAULT_LANG]: getAttrWithDefault(pageNode, "title", undefined),
        },
        isCollapsed: false,
        isTitlePageEnd:
          getAttrWithDefault(pageNode, "title-page-end", "false") === "true",
      },
    };

    fields.push(pageField);
  }

  if (pageNode.hasChildNodes()) {
    let sectionIndex = 0;
    for (let i = 0; i < pageNode.childNodes.length; i += 1) {
      const child = pageNode.childNodes[i];

      if (child.nodeName === "#comment" || child.nodeName === "#text") {
        continue;
      }

      // if (child.nodeName !== 'section') {
      //   throw new Error('page element contains an element that is not a section: ' +
      //       child.nodeName);
      // }

      if (child.nodeName === "title") {
        assert(pageField);
        pageField.settings.labelI18n[getRequiredAttr(child, "lang")] =
          child.textContent;
      } else if (
        (child.nodeName === "visibility_rules" ||
          child.nodeName === "print_tag_rules") &&
        child.hasChildNodes()
      ) {
        assert(pageField);
        pageField.node = pageNode;
      } else {
        readSection(fields, child, sectionIndex);
        sectionIndex += 1;
      }
    }
  }
}

function readSection(fields, sectionNode, sectionIndex) {
  let sectionField = null;

  if (
    sectionIndex !== 0 ||
    hasChildNode(sectionNode, "title") ||
    sectionNode.hasAttribute("title") ||
    hasChildNode(sectionNode, "description") ||
    sectionNode.hasAttribute("description")
  ) {
    sectionField = {
      id: getAttrWithDefault(sectionNode, "guid", uuid.v4()),
      type: "sectionBreak",
      settings: {
        identifier: getAttrWithDefault(sectionNode, "identifier", ""),
        labelI18n: {
          [DEFAULT_LANG]: getAttrWithDefault(sectionNode, "title", undefined),
        },
        important: getRequiredAttr(sectionNode, "important") === "true",
        descriptionI18n: {
          [DEFAULT_LANG]: getAttrWithDefault(
            sectionNode,
            "description",
            undefined
          ),
        },
        isCollapsed: false,
        qrCodeReader:
          getAttrWithDefault(sectionNode, "qr-code-reader", "false") === "true",
      },
    };

    fields.push(sectionField);
  }

  if (sectionNode.hasChildNodes()) {
    for (let i = 0; i < sectionNode.childNodes.length; i += 1) {
      const child = sectionNode.childNodes[i];

      if (child.nodeName === "#text" || child.nodeName === "#comment") {
        continue;
      }

      if (child.nodeName === "title") {
        assert(sectionField);
        sectionField.settings.labelI18n[getRequiredAttr(child, "lang")] =
          child.textContent;
      } else if (child.nodeName === "description") {
        assert(sectionField);
        sectionField.settings.descriptionI18n[getRequiredAttr(child, "lang")] =
          child.textContent;
      } else if (
        child.nodeName === "visibility_rules" ||
        child.nodeName === "print_tag_rules"
      ) {
        assert(sectionField);
        sectionField.node = sectionNode;
      } else {
        readField(fields, child);
      }
    }
  }
}

// This reads a form field EXCEPT the visRules. We read those in a second pass because we need to
// be able to find the referenced field
function readField(fields, fieldNode) {
  const types = Object.keys(FieldTypes);

  for (let i = 0; i < types.length; i += 1) {
    const type = types[i];
    const fieldIo = FieldTypes[type].io;

    if (fieldIo.canDeserialize(fieldNode)) {
      const field = fieldIo.deserialize(fieldNode);
      field.node = fieldNode;
      fields.push(field);
      return;
    }
  }

  throw new Error("Unknown field element: " + fieldNode.nodeName);
}

function readVisRules(fields, fieldNode) {
  if (!fieldNode) {
    return [];
  }

  if (hasChildNode(fieldNode, "visibility_rules")) {
    const rulesNode = getChildNode(fieldNode, "visibility_rules");

    return parseVisRulesNode(fields, rulesNode);
  } else {
    return [];
  }
}

function parseVisRulesNode(fields, node) {
  assert(node.nodeName === "visibility_rules");

  let positionRule = 0;
  const op = getAttrWithDefault(node, "operator", "");

  const result = [];
  result.operator = op;

  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];

      switch (child.nodeName) {
        case "condition":
          positionRule = positionRule + 1;
          var condition = parseConditionNode(fields, child, positionRule);
          // condition.conjunctionOperator = condition.conjunctionOperator; // store conjuction operator to each condition
          result.push(condition);
          break;
        case "visibility_rules":
          result.push(parseVisRulesNode(fields, child));
          break;
        case "#comment": // fall thru
        case "#text":
          // ignore this
          break;
        default:
          throw new Error(
            "visibility_rules element contains illegal child: " + child.nodeName
          );
      }
    }
  }

  if (result.length <= 1) {
    result.operator = "and";
  }

  return result;
}

function parseConditionNode(fields, node, positionRule) {
  assert(node.nodeName === "condition");

  const otherIdentifier = getRequiredAttr(node, "field-identifier");
  const otherFields = fields.filter(
    (f) => f.settings.identifier === otherIdentifier
  );
  if (otherFields.length !== 1) {
    throw new Error(
      "Invalid SFDL: Form contains multiple fields with the same identifier: " +
        otherIdentifier
    );
  }
  const otherField = otherFields[0];

  let operatorId = getRequiredAttr(node, "operator");
  const argType = Ops[operatorId].argType;

  let conjunctionOperator = getAttrWithDefault(
    node,
    "conjunction-operator",
    "and"
  );
  let argument = convertRuleArgument(
    argType,
    getRequiredAttr(node, "argument"),
    otherField
  );

  let type = getAttrWithDefault(node, "type", undefined);

  let position = parseInt(getAttrWithDefault(node, "positionRule", undefined));

  // HACK to support opening old versions
  if (operatorId === "isBool" && otherField.type === "naYesNo") {
    operatorId = "isExtBool";
    argument = String(argument);
  }

  return {
    id: uuid.v4(),
    fieldId: otherField.id,
    operatorId: operatorId,
    argument: argument,
    conjunctionOperator: conjunctionOperator,
    type: type,
    positionRule: position ? position : positionRule,
    isInternal: true,
  };
}

function convertRuleArgument(argType, argument, field) {
  switch (argType) {
    case "bool":
      return argument === "true";
    case "extBool":
      assert(["", "na", "fixed", "true", "false"].includes(argument));
      return argument;
    case "date":
      return moment(argument, "YYYY-MM-DD");
    case "number":
      return Number(argument);
    case "optionId":
      if (argument !== FREE_TEXT_VALUE) {
        const otherOption = field.settings.options.find(
          (option) => option.value === argument
        );
        return otherOption.value;
      } else {
        return argument;
      }
    // assert(false);
    // return 42; // shut up eslint
    case "string":
      return argument;
    default:
      throw new Error("Unknown visibility rule argument type: " + argType);
  }
}

function readExtVisRules(fields, fieldNode, position) {
  if (!fieldNode) {
    return [];
  }

  if (hasChildNode(fieldNode, "external_visibility_rules")) {
    const rulesNode = getChildNode(fieldNode, "external_visibility_rules");

    return parseExtVisRulesNode(fields, rulesNode, position);
  } else {
    return [];
  }
}

function parseExtVisRulesNode(fields, node, position) {
  assert(node.nodeName === "external_visibility_rules");

  let positionRule = getLastPostionOfVisRules(fields, position);
  const op = getAttrWithDefault(node, "operator", "");

  const result = [];
  result.operator = op;

  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];

      switch (child.nodeName) {
        case "condition":
          positionRule = positionRule + 1;
          var condition = parseExtConditionNode(fields, child, positionRule);
          // condition.conjunctionOperator = condition.conjunctionOperator; // store conjuction operator to each condition
          result.push(condition);
          break;
        case "external_visibility_rules":
          result.push(parseExtVisRulesNode(fields, child, position));
          break;
        case "#comment": // fall thru
        case "#text":
          // ignore this
          break;
        default:
          throw new Error(
            "external_visibility_rules element contains illegal child: " +
              child.nodeName
          );
      }
    }
  }

  if (result.length <= 1) {
    result.operator = "and";
  }

  return result;
}

function getLastPostionOfVisRules(checkList, position) {
  const getPositionVR = checkList[position].settings.visRules.map((rules) => {
    return rules.positionRule;
  });
  return Math.max(...getPositionVR);
}

function parseExtConditionNode(checkList, node, positionRule) {
  assert(node.nodeName === "condition");

  const conditionNode = getChildNode(node, "external_form");
  const deserializeResult = deserialize(conditionNode.textContent, true);

  if (deserializeResult.error) {
    const { error } = deserializeResult;
    throw new Error("external_visibility_rules error: " + error);
  }

  const { form, fields } = deserializeResult;

  const otherIdentifier = getRequiredAttr(node, "field-identifier");
  const otherFields = fields.filter(
    (f) => f.settings.identifier === otherIdentifier
  );
  if (otherFields.length !== 1) {
    throw new Error(
      "Invalid SFDL: Form contains multiple fields with the same identifier: " +
        otherIdentifier
    );
  }
  const otherField = otherFields[0];

  let operatorId = getRequiredAttr(node, "operator");
  const argType = Ops[operatorId].argType;

  let conjunctionOperator = getAttrWithDefault(
    node,
    "conjunction-operator",
    "and"
  );

  let argument = convertRuleArgument(
    argType,
    getRequiredAttr(node, "argument"),
    otherField
  );

  let position = parseInt(getAttrWithDefault(node, "positionRule", undefined));
  // HACK to support opening old versions
  if (operatorId === "isBool" && otherField.type === "naYesNo") {
    operatorId = "isExtBool";
    argument = String(argument);
  }

  return {
    id: uuid.v4(),
    fieldId: otherField.id,
    operatorId: operatorId,
    argument: argument,
    conjunctionOperator: conjunctionOperator,
    form: form,
    fields: fields,
    positionRule: position ? position : positionRule,
    isInternal: false,
  };
}

function readAuthorizationRules(authorizationUniverse, field, fieldNode) {
  if (fieldNode === undefined) {
    return [];
  }

  const findAuthorizationId = (name) => {
    const authorization = authorizationUniverse.find((t) => t.name === name);
    return authorization.id;
  };

  if (hasChildNode(fieldNode, "authorization_rules")) {
    const rulesNode = getChildNode(fieldNode, "authorization_rules");
    const alwaysAddNodes = getChildNodes(rulesNode, "authorization");

    const alwaysAddRules = alwaysAddNodes.map((tagNode) => {
      const authorizationName = getRequiredAttr(tagNode, "name");
      const authorizationId = findAuthorizationId(authorizationName);
      return {
        id: uuid.v4(),
        authorizationId: authorizationId,
        authorizationName: authorizationName,
      };
    });

    return alwaysAddRules;
  } else {
    return [];
  }
}

function readTagRules(tagUniverse, field, fieldNode) {
  if (fieldNode === undefined) {
    return [];
  }

  const findTagId = (name) => {
    const tag = tagUniverse.find((t) => t.name === name);
    assert(tag);
    return tag.id;
  };

  if (hasChildNode(fieldNode, "tag_rules")) {
    const rulesNode = getChildNode(fieldNode, "tag_rules");

    const ruleNodes = getChildNodes(rulesNode, "tag_rule");
    const alwaysAddNodes = getChildNodes(rulesNode, "tag");

    const alwaysAddRules = alwaysAddNodes.map((tagNode) => {
      const tagName = getRequiredAttr(tagNode, "name");
      const tagId = findTagId(tagName);
      const operator = FieldTypes[field.type].applicableOperators[0];
      return {
        id: uuid.v4(),
        tagId: tagId,
        operatorId: operator.id,
        argument: getDefaultValue(operator.argType, field),
        alwaysAdd: true,
      };
    });

    const normalRules = ruleNodes.map((ruleNode) => {
      const tagName = getRequiredAttr(ruleNode, "tag");
      const tagId = findTagId(tagName);
      const operatorId = getRequiredAttr(ruleNode, "operator");
      const argType = Ops[operatorId].argType;
      const argument = convertRuleArgument(
        argType,
        getRequiredAttr(ruleNode, "argument"),
        field
      );

      return {
        id: uuid.v4(),
        tagId: tagId,
        operatorId: operatorId,
        argument: argument,
        alwaysAdd: false,
      };
    });

    return alwaysAddRules.concat(normalRules);
  } else {
    return [];
  }
}

function readPrintTagRules(printTagUniverse, field, fieldNode) {
  if (fieldNode === undefined) {
    return [];
  }

  const findTagId = (name) => {
    const tag = printTagUniverse.find((t) => t.name === name);
    return tag.id;
  };

  if (hasChildNode(fieldNode, "print_tag_rules")) {
    const rulesNode = getChildNode(fieldNode, "print_tag_rules");
    const alwaysAddNodes = getChildNodes(rulesNode, "tag");

    const alwaysAddRules = alwaysAddNodes.map((tagNode) => {
      const tagName = getRequiredAttr(tagNode, "name");
      const tagId = findTagId(tagName);
      return {
        id: uuid.v4(),
        tagId: tagId,
        tagName: tagName,
      };
    });

    return alwaysAddRules;
  } else {
    return [];
  }
}

function readButtonDescriptions(fields, fieldNode) {
  if (hasChildNode(fieldNode, "button_descriptions")) {
    const buttonDescriptionsNode = getChildNode(
      fieldNode,
      "button_descriptions"
    );

    return parseButtonDescriptionNode(fields, buttonDescriptionsNode);
  } else {
    return [];
  }
}

function parseButtonDescriptionNode(fields, node) {
  assert(node.nodeName === "button_descriptions");

  const result = [];

  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];

      if (child.nodeName === "#comment" || child.nodeName === "#text") {
        continue;
      }

      const selectedDescriptionId = getRequiredAttr(
        child,
        "selected-description-id"
      );
      const selectedButtonId = getRequiredAttr(child, "selected-button-id");

      if (child.nodeName === "button_description") {
        result.push({
          id: uuid.v4(),
          selectedDescriptionId: selectedDescriptionId,
          selectedButtonId: selectedButtonId,
        });
      } else {
        throw new Error(
          "button_descriptions element contains illegal child: " +
            child.nodeName
        );
      }
    }
  }

  return result;
}
