/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

let ops = {}; // eslint-disable-line prefer-const

const ARG_TYPES = ["string", "number", "bool", "date", "optionId", "extBool"];

// for the type optionId the value FREE_TEXT_VALUE (from ../utils/options.js)
// can be used for the "Other" option

function addOp(id, name, formulaOp, argType) {
  if (ops[id]) {
    throw new Error("Operator already exists: " + id);
  }
  if (!ARG_TYPES.includes(argType)) {
    throw new Error("Unknown operator argument type: " + argType);
  }

  ops[id] = { id, name, formulaOp, argType };
}

addOp("isString", "is", "==", "string");
addOp("isNotString", "is not", "!=", "string");
addOp("isNumber", "is equal to", "==", "number");
addOp("isNotNumber", "is not equal to", "!=", "number");
addOp("isOption", "is", "==", "optionId");
addOp("isNotOption", "is not", "!=", "optionId");
addOp("isBool", "is", "==", "bool");
addOp("isExtBool", "is", "==", "extBool");
addOp("isNotExtBool", "is not", "!=", "extBool");
addOp("isDate", "is", "==", "date");
addOp("isNotDate", "is not", "!=", "date");
addOp("before", "is before", "before", "date");
addOp("after", "is after", "after", "date");
addOp("startsWith", "starts with", "startsWith", "string");
addOp("endsWith", "ends with", "endsWith", "string");
addOp("greaterThan", "is greater than", ">=", "number");
addOp("lessThan", "is less than", "<=", "number");
addOp("containsString", "contains", "contains", "string");
addOp("containsOption", "contains", "contains", "optionId");
addOp("doesNotContainString", "does not contain", "doesntContain", "string");
addOp("doesNotContainOption", "does not contain", "doesntContain", "optionId");

export default ops;
