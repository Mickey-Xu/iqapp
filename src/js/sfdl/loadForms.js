/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import deserialize from "./deserialize";
import assert from "assert";
import moment from "moment";

function assertAllInstances(forms) {
  forms.forEach(({ name, form }) => {
    if (!form.instanceId) {
      throw new Error(`${name}: Not a form instance!`);
    }
  });
}

function assertAllSameIdentifier(forms) {
  const identifier = forms[0].form.settings.identifier;
  const allSameIdentifier = forms.every(
    ({ form }) => form.settings.identifier === identifier
  );

  if (!allSameIdentifier) {
    throw new Error(`Expected all forms to have identifier "${identifier}".`);
  }
}

export default function loadForms(formsSfdl) {
  assert(formsSfdl.length > 0);

  const forms = formsSfdl.map(({ name, sfdl }) => {
    const deserializeResult = deserialize(sfdl);

    if (deserializeResult.error) {
      const { error } = deserializeResult;
      throw new Error(`${name}: ${error}`);
    } else {
      const { fields, form } = deserializeResult;
      const lastEditDate =
        form.history
          .map((h) => h.exportDate)
          .sort((d1, d2) => {
            return d2.getTime() - d1.getTime();
          })[0] || new Date();
      const fieldsWithDateAndFormId = fields.map((f) =>
        Object.assign({}, f, { date: moment(lastEditDate), formId: form.id })
      );
      return { name, form, fields: fieldsWithDateAndFormId };
    }
  });

  assertAllInstances(forms);
  assertAllSameIdentifier(forms);

  return forms;
}
