/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import isValidIdentifier from "../expr/isValidIdentifier";
import assert from "assert";

export function isDuplicateValue(options, value) {
  return options.filter((o) => o.value === value).length >= 2;
}

export function generateUniqueOptionValue(options) {
  for (let i = 1; ; i += 1) {
    const value = `value${i}`;
    if (options.every((o) => o.value !== value)) {
      return value;
    }
  }
}

export function ensureOptionValues(options) {
  options.forEach((option) => {
    if (!option.value) {
      option.value = generateUniqueOptionValue(options);
    }
  });
}

export const FREE_TEXT_VALUE = "free_text_option_value";
assert(isValidIdentifier(FREE_TEXT_VALUE));
