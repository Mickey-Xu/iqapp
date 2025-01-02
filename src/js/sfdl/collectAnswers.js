/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import moment from "moment";
import assert from "assert";
import { DEFAULT_LANG } from "../constants/global";

const COLLECTORS = {
  singleLine: textCollector,
  paragraph: textCollector,
  number: numbersCollector,
  slider: numbersCollector,
  date: dateCollector,
  multipleChoice: optionsCollector,
  dropdown: optionsCollector,
  yesNo: simpleOptionsCollector,
  naYesNo: simpleOptionsCollector,
  checkboxes: optionsCollector,
  calculation: numbersCollector,
  signature: imagesCollector,
  photo: imagesCollector,
};

function normalizeI18n(obj, lang) {
  assert(lang);

  if (Array.isArray(obj)) {
    return obj.map((o) => normalizeI18n(o, lang));
  } else if (typeof obj === "object" && obj !== null && !moment.isMoment(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      if (key.endsWith("I18n") && typeof obj[key] === "object") {
        const newKey = key.slice(0, -4);
        const translationMissing = typeof obj[key][lang] === "undefined";
        const newValue = translationMissing
          ? obj[key][DEFAULT_LANG] || ""
          : obj[key][lang];

        return Object.assign({}, acc, {
          [newKey]: newValue,
        });
      } else {
        const newValue = normalizeI18n(obj[key], lang);
        return Object.assign({}, acc, { [key]: newValue });
      }
    }, {});
  } else {
    return obj;
  }
}

function textCollector(fields) {
  // singleLine, paragraph
  return fields
    .filter((f) => f.settings.text)
    .map((f) => ({
      formId: f.formId,
      date: f.date,
      answer: f.settings.text,
    }));
}

function numbersCollector(fields) {
  // number, slider, calculation
  return fields
    .filter((f) => typeof f.settings.value === "number")
    .map((f) => f.settings.value);
}

function dateCollector(fields) {
  // date
  return []; // TODO implement this
}

function optionsCollector(fields) {
  // multpleChoice, dropdown, checkboxes
  const otherText = "Other";

  const { settings: firstSettings } = fields[0];
  const options = firstSettings.options
    .map((o) => o.nameI18n.English)
    .reduce((acc, option) => Object.assign({}, acc, { [option]: 0 }), {});

  if (firstSettings.includeOther) {
    options[otherText] = 0;
  }

  const otherAnswers = [];

  fields.forEach((field) => {
    const {
      selectedId,
      selectedIds,
      otherOptionSelected,
      otherOptionText,
    } = field.settings;

    if (selectedId) {
      const selectedOptionName = field.settings.options.find(
        (o) => o.id === selectedId
      ).nameI18n.English;
      options[selectedOptionName] = options[selectedOptionName] + 1;
    } else if (selectedIds) {
      field.settings.options
        .filter((o) => selectedIds.includes(o.id))
        .map((o) => o.nameI18n.English)
        .forEach((n) => (options[n] = options[n] + 1));
    }

    if (otherOptionSelected) {
      options[otherText] = options[otherText] + 1;
      otherAnswers.push({
        formId: field.formId,
        date: field.date,
        answer: otherOptionText,
      });
    }
  });

  const nFieldsWithMultpleSelection = fields.filter(
    (f) => f.settings.selectedIds
  ).length;
  if (nFieldsWithMultpleSelection > 0) {
    Object.keys(options).forEach(
      (n) => (options[n] = options[n] / nFieldsWithMultpleSelection)
    );
  }

  return { options, otherAnswers };
}

function simpleOptionsCollector(fields) {
  // yesNo, naYesNo
  const { type, settings } = fields[0];

  if (type === "naYesNo") {
    const { notApplicableOption, fixedOption } = settings;

    const yesOptions = fields.filter((f) => f.settings.value === "true").length;
    const noOptions = fields.filter((f) => f.settings.value === "false").length;

    if (notApplicableOption && fixedOption) {
      const naOptions = fields.filter((f) => f.settings.value === "na").length;
      const fixedOptions = fields.filter((f) => f.settings.value === "fixed")
        .length;
      return {
        Yes: yesOptions,
        No: noOptions,
        "N/A": naOptions,
        Fixed: fixedOptions,
      };
    } else if (notApplicableOption) {
      const naOptions = fields.filter((f) => f.settings.value === "na").length;
      return {
        Yes: yesOptions,
        No: noOptions,
        "N/A": naOptions,
      };
    } else if (fixedOption) {
      const fixedOptions = fields.filter((f) => f.settings.value === "fixed")
        .length;
      return {
        Yes: yesOptions,
        No: noOptions,
        Fixed: fixedOptions,
      };
    } else {
      return {
        Yes: yesOptions,
        No: noOptions,
      };
    }
  } else if (type === "yesNo") {
    const yesOptions = fields.filter((f) => f.settings.initialValue).length;
    const noOptions = fields.length - yesOptions;
    return {
      Yes: yesOptions,
      No: noOptions,
    };
  } else {
    throw new Error("Unknown type for simpleOptions: " + type);
  }
}

function imagesCollector(fields) {
  // signature, photo
  return fields
    .filter((f) => f.settings.dataUrl)
    .map((f) => ({
      date: f.date,
      dataUrl: f.settings.dataUrl,
      formId: f.formId,
    }));
}

function buildOutline(forms, lang) {
  const { form: firstForm, fields: firstFields } = forms[0];

  const outline = normalizeI18n(
    {
      languages: firstForm.languages,
      labelI18n: firstForm.settings.titleI18n,
      descriptionI18n: firstForm.settings.descriptionI18n,
      fields: firstFields.map(({ id, type, settings }) => ({
        id: id,
        type: type,
        settings: settings,
        annotations: [],
        answers: null,
      })),
    },
    lang
  );

  normalizeI18n(forms, lang).forEach(({ name, form, fields }) => {
    if (form.settings.title !== outline.label) {
      throw new Error(
        `${name} has different title then other forms ` +
          `(${form.settings.title} vs. ${outline.label})`
      );
    }
    if (form.settings.description !== outline.description) {
      throw new Error(
        `${name} has different description then other forms ` +
          `(${form.settings.description} vs. ${outline.description})`
      );
    }

    if (outline.fields.length !== fields.length) {
      throw new Error(
        `${name} has different number of fields then other forms ` +
          `(${fields.length} vs. ${outline.fields.length})`
      );
    }

    for (let i = 0; i < fields.length; i += 1) {
      if (outline.fields[i].type !== fields[i].type) {
        throw new Error(
          `${name} field ${i} has different field-type then other forms ` +
            `${fields[i].type} vs. ${outline.fields[i].type})`
        );
      }
    }
  });

  return outline;
}

function collectAnswersForField(fields) {
  const type = fields[0].type;
  assert(fields.every(({ type: t }) => t === type));

  const collector = COLLECTORS[type];

  if (collector) {
    return collector(fields);
  } else {
    return null;
  }
}

function collectAnnotationsForField(fields) {
  const annotations = fields
    .filter((f) => f.annotation)
    .map((f) =>
      Object.assign({}, f.annotation, {
        date: moment(f.date),
        formId: f.formId,
      })
    );

  return annotations;
}

function checkFilter(filter, field) {
  if (filter.type === "option") {
    const option = field.settings.options.find(
      (o) => o.nameI18n.English === filter.value
    );
    if (!option && filter.value === "Other") {
      return field.settings.otherOptionSelected;
    } else {
      if (field.settings.selectedId) {
        return field.settings.selectedId === option.id;
      } else if (field.settings.selectedIds) {
        return field.settings.selectedIds.includes(option.id);
      } else {
        return false; // nothing selected
      }
    }
  } else if (filter.type === "numberRange") {
    const value = field.settings.value;
    const { low, high, upperBoundInclusive } = filter.value;

    return (
      typeof value === "number" &&
      value >= low &&
      (upperBoundInclusive ? value <= high : value < high)
    );
  } else if (filter.type === "simpleOption") {
    if (field.type === "naYesNo") {
      const filterToField = {
        Yes: "true",
        No: "false",
        "N/A": "na",
        Fixed: "fixed",
      };
      return filterToField[filter.value] === field.settings.value;
    } else if (field.type === "yesNo") {
      return field.settings.initialValue === (filter.value === "Yes");
    } else {
      throw new Error(
        `Field with type ${field.type} cannot be filtered with "simpleOption" filter`
      );
    }
  } else {
    throw new Error("Unknown filter type: " + filter.type);
  }
}

function idToFieldIndex(forms, id) {
  return forms[0].fields.findIndex((f) => f.id === id);
}

function meetsFilterCriteria(forms, filters, form) {
  return filters.every((filter) => {
    const field = form.fields[idToFieldIndex(forms, filter.fieldId)];
    return checkFilter(filter, field);
  });
}

function filterForms(forms, filters) {
  if (filters.length === 0) {
    return forms;
  } else {
    return forms.filter((form) => meetsFilterCriteria(forms, filters, form));
  }
}

export default function collectAnswers(
  forms,
  lang,
  filters = [],
  compare = null
) {
  assert(forms.length > 0);

  let data = buildOutline(forms, lang); // eslint-disable-line prefer-const

  let formsPartition;

  if (compare && compare.alternatives.length >= 2) {
    formsPartition = compare.alternatives.map((altValue) => {
      const filter = {
        fieldId: compare.fieldId,
        type: compare.type,
        value: altValue,
      };

      return filterForms(forms, filters.concat([filter]));
    });
  } else {
    formsPartition = [filterForms(forms, filters)];
  }

  const allDisplayedForms = formsPartition.reduce(
    (acc, fs) => acc.concat(fs),
    []
  );
  const formsCount = allDisplayedForms.length;

  if (formsCount > 0) {
    for (let i = 0; i < forms[0].fields.length; i += 1) {
      const allDisplayedFields = allDisplayedForms.map(({ fields: f }) => f[i]);
      data.fields[i].annotations =
        allDisplayedFields.length > 0
          ? collectAnnotationsForField(allDisplayedFields)
          : [];

      data.fields[i].answersForAlternatives = formsPartition.map((altForms) => {
        if (altForms.length === 0) {
          return null;
        } else {
          const altFields = altForms.map(({ fields: f }) => f[i]);
          return collectAnswersForField(altFields);
        }
      });
    }
  }

  return Object.assign({}, data, { formsCount });
}
