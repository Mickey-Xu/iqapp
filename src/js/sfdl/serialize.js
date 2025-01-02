import assert from "assert";
import {
  SFDL_VERSION,
  XSD_VERSION,
  RETURN_TO_APP_URLS,
  DEFAULT_LANG,
} from "./constants/global";
import FieldTypes from "./constants/FieldTypes";
import {
  appendChild,
  appendVisRules,
  appendImages,
  appendTagRules,
  appendPrintTagRules,
  //   appendAuthorizationRules,
  appendExtVisRules,
} from "./utils/xml";
import isValidIdentifier, {
  removeXMLInvalidChars,
} from "./expr/isValidIdentifier";
import { encrypt } from "./utils/crypto";
import _ from "lodash";
import uuid from "node-uuid";
import setupIO from "./setup";

function buildSfdl(doc, formMetaData, fields) {
  if (!formMetaData.settings.status) {
    formMetaData.settings.status = "unknown";
  }

  const form = doc.createElement("form");
  doc.appendChild(form);
  form.setAttribute("version", SFDL_VERSION);
  form.setAttribute("identifier", formMetaData.settings.identifier);
  form.setAttribute("status", formMetaData.settings.status);
  form.setAttribute(
    "global-template",
    formMetaData.settings.globalTemplate !== undefined
      ? formMetaData.settings.globalTemplate
      : "0"
  );
  form.setAttribute(
    "include-geo-location",
    formMetaData.settings.includeGeoLocation
  );
  form.setAttribute("send-once", formMetaData.settings.sendOnce);
  form.setAttribute(
    "force-save-multi-language",
    formMetaData.settings.forceSaveMultiLanguage
  );
  form.setAttribute(
    "template-version",
    formMetaData.settings.globalTemplate === "1"
      ? formMetaData.templateVersion
      : ""
  );
  form.setAttribute("instance-id", "");
  form.setAttribute("geo-location", "");
  form.setAttribute("template-guid", formMetaData.id);
  form.setAttribute("xsd-version", XSD_VERSION);
  form.setAttribute("kg-code", formMetaData.settings.kgCode);
  form.setAttribute(
    "max-number-of-pictures",
    formMetaData.settings.maxNumberOfPictures
  );

  buildTitleAndDescription(doc, form, formMetaData);
  buildLogo(doc, form, formMetaData);
  buildLanguages(doc, form, formMetaData);
  buildAuthorizationUniveerse(doc, form, formMetaData);
  buildTagUniverse(doc, form, formMetaData);
  buildPrintTagUniverse(doc, form, formMetaData);
  buildTagRulesInFilter(doc, form, formMetaData);
  buildPrintSettings(doc, form, formMetaData);
  buildFormActions(doc, form, formMetaData);
  buildFormMetadata(doc, form, formMetaData);
  buildBuildingBlocks(doc, form, formMetaData);

  const findField = (id) => fields.find((f) => f.id === id);
  const authorizationUniverse = formMetaData.settings.authorizationUniverse;
  const tagUniverse = formMetaData.settings.tagUniverse;
  const printTagUniverse = formMetaData.settings.printTagUniverse;

  extractPages(fields).forEach((pageData) => {
    const {
      id,
      identifier,
      labelI18n,
      visRules,
      fields: pageFields,
      isTitlePageEnd,
      tagRules,
      printTagRules,
      externalVisRules,
    } = pageData;
    const page = appendChild(doc, form, "page", null, {
      guid: id,
      identifier: identifier,
      "title-page-end": isTitlePageEnd,
    });

    if (labelI18n) {
      Object.keys(labelI18n).forEach((lang) => {
        if (typeof labelI18n[lang] !== "undefined") {
          appendChild(doc, page, "title", labelI18n[lang], { lang });
        }
      });
    }

    if (visRules) {
      appendVisRules(doc, findField, page, visRules);
    }

    if (externalVisRules) {
      appendExtVisRules(doc, findField, page, externalVisRules);
    }

    if (tagRules) {
      appendTagRules(doc, page, null, tagRules);
    }

    if (printTagRules) {
      //updatePrintTagValue
      let printTagRulesWithLatestName = printTagRules.map((rule) => {
        const tag = printTagUniverse.find((t) => t.id === rule.tagId);
        return Object.assign({}, rule, { tagName: tag.name });
      });
      appendPrintTagRules(doc, page, null, printTagRulesWithLatestName);
    }

    extractSections(pageFields).forEach((sectionData) => {
      const {
        id,
        identifier,
        labelI18n,
        important,
        descriptionI18n,
        visRules,
        fields: sectionFields,
        // authorizationRules,
        tagRules,
        printTagRules,
        qrCodeReader,
      } = sectionData;
      const section = appendChild(doc, page, "section", null, {
        guid: id,
        identifier: identifier,
        important: important,
        "qr-code-reader": qrCodeReader,
      });

      if (labelI18n) {
        Object.keys(labelI18n).forEach((lang) => {
          if (typeof labelI18n[lang] !== "undefined") {
            appendChild(doc, section, "title", labelI18n[lang], { lang });
          }
        });
      }

      if (descriptionI18n) {
        Object.keys(descriptionI18n).forEach((lang) => {
          if (typeof descriptionI18n[lang] !== "undefined") {
            appendChild(doc, section, "description", descriptionI18n[lang], {
              lang,
            });
          }
        });
      }

      if (visRules) {
        appendVisRules(doc, findField, section, visRules);
      }

      if (tagRules) {
        appendTagRules(doc, section, null, tagRules);
      }

      if (printTagRules) {
        //updatePrintTagValue
        let printTagRulesWithLatestName = printTagRules.map((rule) => {
          const tag = printTagUniverse.find((t) => t.id === rule.tagId);
          return Object.assign({}, rule, { tagName: tag.name });
        });
        appendPrintTagRules(doc, section, null, printTagRulesWithLatestName);
      }

      sectionFields.forEach(
        buildFormField.bind(
          null,
          doc,
          findField,
          authorizationUniverse,
          tagUniverse,
          printTagUniverse,
          section
        )
      );
    });
  });
}

function buildTitleAndDescription(doc, form, formMetaData) {
  const { titleI18n, descriptionI18n } = formMetaData.settings;

  Object.keys(titleI18n).forEach((lang) => {
    if (typeof titleI18n[lang] !== "undefined") {
      appendChild(doc, form, "title", titleI18n[lang], { lang });
    }
  });

  Object.keys(descriptionI18n).forEach((lang) => {
    if (typeof descriptionI18n[lang] !== "undefined") {
      appendChild(doc, form, "description", descriptionI18n[lang], { lang });
    }
  });
}

function buildLogo(doc, form, formMetaData) {
  const { logos } = formMetaData.settings;

  const logosNode = appendChild(doc, form, "logos");
  appendImages(doc, logosNode, logos);
}

function buildLanguages(doc, form, formMetaData) {
  const languages = appendChild(doc, form, "languages");

  formMetaData.languages.forEach((lang) => {
    appendChild(doc, languages, "language", lang, {
      fallback: lang === formMetaData.fallbackLang,
    });
  });
}

function buildAuthorizationUniveerse(doc, form, formMetaData) {
  const authorizationUniverse = appendChild(doc, form, "authorizations");

  formMetaData.settings.authorizationUniverse
    .map((authorization) => authorization.name)
    .filter((authorization) => isValidIdentifier(authorization))
    .forEach((authorization) =>
      appendChild(doc, authorizationUniverse, "authorization", "", {
        name: authorization,
      })
    );
}

function buildTagUniverse(doc, form, formMetaData) {
  const tagUniverse = appendChild(doc, form, "tags");

  formMetaData.settings.tagUniverse
    .map((tag) => tag.name)
    .filter((tag) => isValidIdentifier(tag))
    .forEach((tag) => appendChild(doc, tagUniverse, "tag", "", { name: tag }));
}

function buildPrintTagUniverse(doc, form, formMetaData) {
  const tagUniverse = appendChild(doc, form, "print_tags");

  formMetaData.settings.printTagUniverse
    .filter((tag) => isValidIdentifier(tag.name))
    .forEach((tag) =>
      appendChild(doc, tagUniverse, "tag", "", {
        name: tag.name,
        "exclude-from-output": tag.excludeFromOutput,
      })
    );
}

function buildTagRulesInFilter(doc, form, formMetaData) {
  const { tagRulesInFilter } = formMetaData.settings;
  appendChild(doc, form, "tag_rules_in_filter", tagRulesInFilter);
}

function buildPrintSettings(doc, form, formMetaData) {
  const {
    printHeader,
    headerText,
    printFooter,
    footerText,
  } = formMetaData.settings.printSettings;

  const settings = appendChild(doc, form, "print_settings", "", {
    "header-required": printHeader,
    "footer-required": printFooter,
  });

  appendChild(doc, settings, "header", headerText);
  appendChild(doc, settings, "footer", footerText);
}

function buildFormActions(doc, form, formMetaData) {
  if (formMetaData.settings.emailAction.selected) {
    const emailAction = appendChild(doc, form, "email_action");

    var { attachmentType } = formMetaData.settings.emailAction;
    if (!attachmentType || attachmentType.length === 0) {
      attachmentType = "all";
    }

    emailAction.setAttribute("attachment-type", attachmentType);

    formMetaData.settings.emailAction.receivers
      .map((email) => email.trim())
      .filter((email) => email !== "")
      .forEach(appendChild.bind(null, doc, emailAction, "receiver"));
  }

  if (formMetaData.settings.returnToApp.selected) {
    const appId = formMetaData.settings.returnToApp.appId.trim();
    if (appId !== "") {
      const returnAppAction = appendChild(doc, form, "return_to_app_action");
      appendChild(
        doc,
        returnAppAction,
        "app_url",
        formMetaData.settings.returnToApp.appId
      );
    }
  }

  if (formMetaData.settings.webDavAction.selected) {
    const webDavAction = appendChild(doc, form, "webdav_action");

    ["server", "path", "username", "password"].forEach((key) => {
      appendChild(
        doc,
        webDavAction,
        key,
        encrypt(formMetaData.settings.webDavAction[key])
      );
    });

    var { fileType } = formMetaData.settings.webDavAction;
    if (!fileType || fileType.length === 0) {
      fileType = "xml";
    }

    appendChild(doc, webDavAction, "file-type", fileType);
  }
}

function buildFormMetadata(doc, form, formMetaData) {
  const metadataNode = appendChild(doc, form, "meta_datas");

  formMetaData.settings.metadata
    .map((item) => {
      return { key: item.key.trim(), value: item.value.trim() };
    })
    .filter((item) => item.key !== "" && item.value !== "")
    .forEach((item) => {
      appendChild(doc, metadataNode, "meta_data", null, {
        key: item.key,
        value: item.value,
      });
    });
}

function buildBuildingBlocks(doc, form, formMetaData) {
  if (formMetaData.settings.blocks !== undefined) {
    const blocksArraryNode = appendChild(doc, form, "blocks");

    formMetaData.settings.blocks.forEach((item) => {
      const blockNode = appendChild(doc, blocksArraryNode, "block", null, {
        guid: item.guid,
        identifier: item.identifier,
        title: item.title,
        src: item.src,
      });

      item.fields.forEach((fieldGuid) => {
        appendChild(doc, blockNode, "field", null, { guid: fieldGuid });
      });
    });
  }
}

function extractPages(fields) {
  // returns array of array of {label, visRules, fields}
  const result = fields.reduce(
    (acc, field) => {
      if (field.type === "pageBreak") {
        const { id } = field;
        const {
          identifier,
          labelI18n,
          visRules,
          isTitlePageEnd,
          tagRules,
          printTagRules,
          externalVisRules,
        } = field.settings;
        acc.push({
          id,
          identifier,
          labelI18n,
          visRules,
          fields: [],
          isTitlePageEnd,
          tagRules,
          printTagRules,
          externalVisRules,
        });
        return acc;
      } else {
        const currentPage = acc[acc.length - 1];
        currentPage.fields.push(field);
        return acc;
      }
    },
    [
      {
        identifier: "pagebreak-no-content",
        labelI18n: null,
        visRules: [],
        fields: [],
        tagRules: [],
        printTagRules: [],
        externalVisRules: [],
      },
    ]
  );

  // When fields starts with a pageBreak then our initial value for the accumulator above
  // can be removed:
  const firstPage = result[0];
  if (
    firstPage.labelI18n === null &&
    firstPage.descriptionI18n === null &&
    firstPage.fields.length === 0
  ) {
    result.splice(0, 1);
  }

  return result;
}

function extractSections(fields) {
  // returns array of {label, description, fields}
  const result = fields.reduce(
    (acc, field) => {
      if (field.type === "sectionBreak") {
        const { id } = field;
        const {
          identifier,
          labelI18n,
          important,
          descriptionI18n,
          visRules,
          tagRules,
          printTagRules,
          qrCodeReader,
          externalVisRules,
        } = field.settings;
        acc.push({
          id,
          identifier,
          labelI18n,
          important,
          descriptionI18n,
          visRules,
          fields: [],
          tagRules,
          printTagRules,
          qrCodeReader,
          externalVisRules,
        });
        return acc;
      } else {
        const currentSection = acc[acc.length - 1];
        currentSection.fields.push(field);
        return acc;
      }
    },
    [
      {
        identifier: "sectionbreak-no-content",
        labelI18n: null,
        important: false,
        descriptionI18n: null,
        visRules: [],
        fields: [],
        tagRules: [],
        printTagRules: [],
        qrCodeReader: false,
        externalVisRules: [],
      },
    ]
  );

  // When fields starts with a sectionBreak then our initial value for the accumulator above
  // can be removed:
  const firstSection = result[0];
  if (
    firstSection.labelI18n === null &&
    firstSection.descriptionI18n === null &&
    firstSection.fields.length === 0
  ) {
    result.splice(0, 1);
  }

  return result;
}

function buildFormField(
  doc,
  findField,
  authorizationUniverse,
  tagUniverse,
  printTagUniverse,
  section,
  field
) {
  const serializer = _.get(FieldTypes, `${field.type}.io.serialize`);
  if (serializer) {
    if (field.settings.authorizationRules) {
      field.settings.authorizationRules = field.settings.authorizationRules.map(
        (rule) => {
          const authorization = authorizationUniverse.find(
            (t) => t.id === rule.authorizationId
          );
          assert(authorization);
          return Object.assign({}, rule, {
            authorizationName: authorization.name,
          });
        }
      );
    }

    if (field.settings.tagRules) {
      field.settings.tagRules = field.settings.tagRules.map((rule) => {
        const tag = tagUniverse.find((t) => t.id === rule.tagId);
        assert(tag);
        return Object.assign({}, rule, { tagName: tag.name });
      });
    }

    if (field.settings.printTagRules) {
      field.settings.printTagRules = field.settings.printTagRules.map(
        (rule) => {
          const tag = printTagUniverse.find((t) => t.id === rule.tagId);
          assert(tag);
          return Object.assign({}, rule, { tagName: tag.name });
        }
      );
    }

    serializer(doc, findField, section, field);
  } else {
    throw new Error("No SFDL serializer found for field-type=" + field.type);
  }
}

let defaultForm = {
  id: uuid.v4(),
  languages: [DEFAULT_LANG],
  fallbackLang: DEFAULT_LANG,
  settings: {
    identifier: "",
    titleI18n: { English: "Untitled Form" },
    globalTemplate: "0",
    descriptionI18n: {
      English:
        "This is a new form. Please add some fields and make it awesome!",
    },
    includeGeoLocation: false,
    sendOnce: false,
    forceSaveMultiLanguage: false,
    authorizationUniverse: [],
    tagUniverse: [], // important: this might contain illegal/blank tags -> ignore them!
    printTagUniverse: [],
    tagRulesInFilter: "0",
    emailAction: {
      selected: false,
      receivers: [],
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
    blocks: [], // hold the building block references
    logos: [],
    kgCode: "",
    maxNumberOfPictures: "10",
    printSettings: {
      printHeader: false,
      headerText: "",
      printFooter: false,
      footerText: "",
    },
  },
};

function removeLanguages(fieldToMap) {
  //remove I18n texts from fields and form settings
  removeLanguageSettings(defaultForm.settings, defaultForm.languages);
  fieldToMap.forEach(function (field) {
    removeLanguageSettings(field.settings, defaultForm.languages);
    if (typeof field.settings.options !== "undefined") {
      field.settings.options.forEach((option) => {
        removeLanguageSettings(option, defaultForm.languages);
      });
    }
  });
}

function removeLanguageSettings(languageSettings, languages) {
  Object.keys(languageSettings).forEach(function (key) {
    if (key.endsWith("I18n") && typeof languageSettings[key] === "object") {
      Object.keys(languageSettings[key]).forEach(function (langKey) {
        if (languages.indexOf(langKey) < 0) {
          delete languageSettings[key][langKey];
        }
      });
    }
  });
}

export default function serialize(data) {
  setupIO();

  const formMetaData = data.form;
  const fields = data.fields;
  const needRemoveLanguages = !!data.needRemoveLanguages;

  // if (formMetaData.instanceId) {
  //   throw new Error("Cannot serialize a form that already has an instance ID!");
  // }

  if (needRemoveLanguages) {
    removeLanguages(fields);
  }

  const doc = document.implementation.createDocument("", "", null);
  buildSfdl(doc, formMetaData, fields);

  const serializer = new XMLSerializer();
  return removeXMLInvalidChars(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      serializer.serializeToString(doc)
  );
}
