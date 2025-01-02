/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import Ops from "./VisibilityOperators";

// When a new form-field is generated, the initialSettings are deep-cloned and all attributes
// with name 'id' are set to a new unique id (also on field duplication)

// The fields displayClass, editorClass, and io are added dynamically on application startup
// (see components/fields/setup.js and sfdl/setup.js). We cannot init them directly here because
// that would create cyclic dependencies (components/fields/SomeDisplay.js imports FieldTypes.js
// imports components/fields/SomeDisplay.js ... and same for sfdl).

// convertibleTo needs to be compatible with applicableOperators: if X can be converted to Y
// then it must also hold that the applicableOperators of X are a subset of those of Y.
// This is also checked in the FormStore when an actual conversion happens.

const STRING_OPS = [
  Ops.isString,
  Ops.isNotString,
  Ops.containsString,
  Ops.doesNotContainString,
  Ops.startsWith,
  Ops.endsWith,
];

const NUMBER_OPS = [
  Ops.isNumber,
  Ops.isNotNumber,
  Ops.greaterThan,
  Ops.lessThan,
];

const BUTTON_DESCRIPTION_OPS = [
  { id: "yes", name: "YES" },
  { id: "no", name: "NO" },
  { id: "na", name: "N/A" },
  { id: "notok", name: "Not OK" },
  { id: "ok", name: "OK" },
  { id: "square", name: "□" },
  { id: "triangle", name: "▽" },
  { id: "fixed", name: "Fixed" },
];

export const CATEGORIES = [
  {
    name: "Basic",
    types: [
      "singleLine",
      "paragraph",
      "number",
      "slider",
      "date",
      "multipleChoice",
      "dropdown",
      "yesNo",
      "checkboxes",
      "staticText",
      "table",
    ],
  },
  {
    name: "Advanced",
    types: ["naYesNo", "calculation", "signature", "photo"],
  },
  {
    name: "Structural",
    types: ["sectionBreak", "pageBreak"],
  },
];

export default {
  singleLine: {
    name: "Single Line Text",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Untitled question" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      prefilledAnswer: "",
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: STRING_OPS,
    convertibleTo: ["paragraph"],
  },

  paragraph: {
    name: "Paragraph Text",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Untitled question" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      prefilledAnswer: "",
      authorizationRules: [],
      visRules: [],
      externalVisRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: STRING_OPS,
    convertibleTo: ["singleLine"],
  },

  number: {
    name: "Number",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Enter a number" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      prefilledAnswer: "",
      min: null,
      max: null,
      unit: "",
      unitFront: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: NUMBER_OPS,
    convertibleTo: [],
  },

  slider: {
    name: "Slider",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Choose a number from the range" },
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      min: 0,
      max: 100,
      step: 5,
      initialValue: 25,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: NUMBER_OPS,
    convertibleTo: [],
  },

  date: {
    name: "Date/Time",
    initialSettings: {
      identifier: "question",
      label: "Select a date",
      labelI18n: { English: "Select a date" },
      required: false,
      important: false,
      annotatable: false,
      includeTime: false,
      pastDateNotAllowed: false,
      futureDateNotAllowed: false,
      changeNotAllowed: false,
      hasDefaultValue: false,
      defaultValue: null,
      descriptionI18n: { English: undefined },
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: [Ops.isDate, Ops.isNotDate, Ops.before, Ops.after],
    convertibleTo: [],
  },

  multipleChoice: {
    name: "Multiple Choice",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Select an option" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      options: [
        { id: null, nameI18n: { English: "Option 1" }, value: "value1" },
        { id: null, nameI18n: { English: "Option 2" }, value: "value2" },
        { id: null, nameI18n: { English: "Option 3" }, value: "value3" },
      ],
      selectedId: null, // null OR INVALID ID (!!) means: nothing selected
      includeOther: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: [Ops.isOption, Ops.isNotOption],
    convertibleTo: ["dropdown"],
  },

  dropdown: {
    name: "Dropdown",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Select an option" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      options: [
        { id: null, nameI18n: { English: "Option 1" }, value: "value1" },
        { id: null, nameI18n: { English: "Option 2" }, value: "value2" },
        { id: null, nameI18n: { English: "Option 3" }, value: "value3" },
      ],
      selectedId: null, // null OR INVALID ID (!!) means: nothing selected
      includeOther: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: [Ops.isOption, Ops.isNotOption],
    convertibleTo: ["multipleChoice"],
  },

  yesNo: {
    name: "Yes/No",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Yes or no" },
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      initialValue: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: [Ops.isBool],
    convertibleTo: [],
  },

  naYesNo: {
    name: "NA/Yes/No",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Yes or no" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      notApplicableOption: true,
      fixedOption: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
      buttonDescriptions: [],
    },
    applicableOperators: [Ops.isExtBool, Ops.isNotExtBool],
    applicableButtonDescriptions: BUTTON_DESCRIPTION_OPS,
    convertibleTo: [],
  },

  checkboxes: {
    name: "Checkboxes",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Select an option" },
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      options: [
        { id: null, nameI18n: { English: "Option 1" }, value: "value1" },
        { id: null, nameI18n: { English: "Option 2" }, value: "value2" },
        { id: null, nameI18n: { English: "Option 3" }, value: "value3" },
      ],
      selectedIds: [], // may also contain ids wich aren't actually options of this Checkbox-Field!
      includeOther: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: [Ops.containsOption, Ops.doesNotContainOption],
    convertibleTo: [],
  },

  calculation: {
    name: "Calculation",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Calculation" },
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      formula: "0",
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: NUMBER_OPS,
    convertibleTo: [],
  },

  signature: {
    name: "Signature",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Sign here" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      images: [],
      tagRules: [],
      printTagRules: [],
    },
    applicableOperators: [],
    convertibleTo: [],
  },

  photo: {
    name: "Photo",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "Take a photo" },
      required: false,
      important: false,
      annotatable: false,
      descriptionI18n: { English: undefined },
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      images: [],
      tagRules: [],
      printTagRules: [],
    },
    applicableOperators: [],
    convertibleTo: [],
  },

  staticText: {
    name: "Static Text",
    initialSettings: {
      identifier: "question",
      textI18n: {
        English:
          "Here you can provide some longer static text and " +
          "images with instructions for the user.",
      },
      important: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: STRING_OPS,
    convertibleTo: [],
  },

  table: {
    name: "Table",
    initialSettings: {
      identifier: "table",
      labelI18n: { English: "A new table" },
      textI18n: {
        English: "Here you can provide table .",
      },
      descriptionI18n: { English: undefined },
      trs: [
        {
          id: null,
          columnHeader: true,
          tds: [
            { id: null, nameI18n: { English: "" }, width: 25 },
            { id: null, nameI18n: { English: "col_1" }, width: 25 },
            { id: null, nameI18n: { English: "col_2" }, width: 25 },
            { id: null, nameI18n: { English: "col_3" }, width: 25 },
          ],
        },
        {
          id: null,
          tds: [
            { id: null, rowHeader: true, nameI18n: { English: "row_1" } },
            { id: null, nameI18n: { English: undefined } },
            { id: null, nameI18n: { English: undefined } },
            { id: null, nameI18n: { English: undefined } },
          ],
        },
        {
          id: null,
          tds: [
            { id: null, rowHeader: true, nameI18n: { English: "row_2" } },
            { id: null, nameI18n: { English: undefined } },
            { id: null, nameI18n: { English: undefined } },
            { id: null, nameI18n: { English: undefined } },
          ],
        },
        {
          id: null,
          tds: [
            { id: null, rowHeader: true, nameI18n: { English: "row_3" } },
            { id: null, nameI18n: { English: undefined } },
            { id: null, nameI18n: { English: undefined } },
            { id: null, nameI18n: { English: undefined } },
          ],
        },
      ],
      required: false,
      important: false,
      changeNotAllowed: false,
      visRules: [],
      externalVisRules: [],
      authorizationRules: [],
      tagRules: [],
      printTagRules: [],
      images: [],
    },
    applicableOperators: STRING_OPS,
    convertibleTo: [],
  },

  sectionBreak: {
    name: "Section Break",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "A new section" },
      important: false,
      qrCodeReader: false,
      descriptionI18n: {
        English: "Put some more information about this section here!",
      },
      isCollapsed: false,
      visRules: [],
      externalVisRules: [],
      tagRules: [],
      printTagRules: [],
    },
    applicableOperators: [],
    convertibleTo: [],
  },

  pageBreak: {
    name: "Page Break",
    initialSettings: {
      identifier: "question",
      labelI18n: { English: "A new page" },
      isCollapsed: false,
      visRules: [],
      externalVisRules: [],
      tagRules: [],
      printTagRules: [],
      isTitlePageEnd: false,
    },
    applicableOperators: [],
    convertibleTo: [],
  },
};
