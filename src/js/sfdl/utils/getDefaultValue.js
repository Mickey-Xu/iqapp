/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import assert from "assert";
import moment from "moment";

export default function getDefaultValue(type, targetField) {
  switch (type) {
    case "number":
      return 0;
    case "string":
      return "";
    case "extBool":
      return "";
    case "bool":
      return false;
    case "date":
      return moment();
    case "optionId":
      const { options } = targetField.settings;
      assert(options.length > 0);
      return options[0].value;
    default:
      throw new Error("Unknown type: " + type);
  }
}
