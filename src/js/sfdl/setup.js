/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import FieldTypes from "./constants/FieldTypes";
// import assert from "assert";

import SingleLineIO from "./SingleLineIO";
import ParagraphTextIO from "./ParagraphTextIO";
import NumberIO from "./NumberIO";
import SignatureIO from "./SignatureIO";
import StaticTextIO from "./StaticTextIO";
import YesNoIO from "./YesNoIO";
import SliderIO from "./SliderIO";
import CheckboxesIO from "./CheckboxesIO";
import NaYesNoIO from "./NaYesNoIO";
import SectionIO from "./SectionIO";
import PageIO from "./PageIO";
import DateIO from "./DateIO";
import CalculationIO from "./CalculationIO";
import PhotoIO from "./PhotoIO";
import TableIO from "./TableIO";
import genericMCIOFactory from "./genericMCIOFactory";

function register(type, io) {
  // assert(type);
  // assert(FieldTypes[type]);
  // assert(io);
  // assert(!FieldTypes[type].io);

  FieldTypes[type].io = io;
}

function checkFieldTypes() {
  const uninitializedTypes = Object.keys(FieldTypes)
    .filter((type) => !FieldTypes[type].io)
    .join(", ");

  if (uninitializedTypes !== "") {
    throw new Error("Uninitialized FieldTypes io: " + uninitializedTypes);
  }
}

export default function setup() {
  register("singleLine", SingleLineIO);
  register("paragraph", ParagraphTextIO);
  register("number", NumberIO);
  register("slider", SliderIO);
  register("date", DateIO);
  register(
    "multipleChoice",
    genericMCIOFactory("multipleChoice", "radio_group")
  );
  register("dropdown", genericMCIOFactory("dropdown", "dropdown"));
  register("yesNo", YesNoIO);
  register("naYesNo", NaYesNoIO);
  register("checkboxes", CheckboxesIO);
  register("signature", SignatureIO);
  register("photo", PhotoIO);
  register("calculation", CalculationIO);
  register("staticText", StaticTextIO);
  register("sectionBreak", SectionIO);
  register("pageBreak", PageIO);
  register("table", TableIO);

  checkFieldTypes();
}
