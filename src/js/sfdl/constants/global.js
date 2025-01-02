/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

export const PRIMARY_FEEDBACK_EMAIL = "norbert.gruner@schindler.com";

export const SFDL_MAJOR_VERSION = Number(
  process.env.REACT_APP_SFDL_MAJOR_VERSION
);

export const SFDL_MINOR_VERSION = Number(
  process.env.REACT_APP_SFDL_MINOR_VERSION
);
export const SFDL_VERSION = `${SFDL_MAJOR_VERSION}.${SFDL_MINOR_VERSION}`;

export const XSD_REVISION = Number(process.env.REACT_APP_XSD_REVISION);

export const XSD_VERSION = `${SFDL_MAJOR_VERSION}.${SFDL_MINOR_VERSION}.${XSD_REVISION}`;

export const APP_NAME = "Schindler FieldCheck";
export const APP_TITLE = "Schindler FieldCheck Editor";
export const APP_VERSION = process.env.REACT_APP_VERSION;
// Uhh that's dirty!
// export const APP_BUILD_DATE = document
//   .getElementById("build-date")
//   .innerHTML.trim();

export const RETURN_TO_APP_URLS = ["fieldlink://handleForm"];

export const DEFAULT_LANG = "English";
export const LANGUAGES = [
  DEFAULT_LANG,
  "Arabic",
  "Bulgarian",
  "Central Khmer",
  "Chinese",
  "Chinese trad.",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "Estonian",
  "Finnish",
  "French",
  "French Canadian",
  "German",
  "Greek",
  "Hebrew",
  "Hungarian",
  "Icelandic",
  "Indonesia",
  "Italian",
  "Japanese",
  "Korean",
  "Latvian",
  "Lithuanian",
  "Malay",
  "Norwegian",
  "Polish",
  "Portuguese",
  "Portuguese Brasil",
  "Romanian",
  "Russian",
  "Serbian",
  "Slovak",
  "Slovenian",
  "Spanish",
  "Spanish Latin America",
  "Swedish",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Vietnamese",
];

export const WEB_DAV_SERVERS = [
  {
    id: "dev",
    name: "DEV",
    server: "https://edocuments-dev.schindler.com/",
    user: "",
    password: "",
  },
  {
    id: "quali",
    name: "QUALI",
    server: "https://edocuments-quali.schindler.com/",
    user: "",
    password: "",
  },
  {
    id: "prod",
    name: "PROD",
    server: "https://edocuments.schindler.com/",
    user: "",
    password: "",
  },
];
