/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

import forge from "node-forge";

const KEY = forge.util.hexToBytes(
  "C8DF55A9BAE39437C383A64B3D0FCBF2BFEDF599C0F4F246128503D0D13370A5"
);
const IV = forge.util.hexToBytes("7DE549A796BFF62AC8E1FB716C57DF46");

export function encrypt(cleartext) {
  const cipher = forge.cipher.createCipher("AES-CBC", KEY);
  cipher.start({ iv: IV });
  cipher.update(forge.util.createBuffer(cleartext));
  cipher.finish();

  return forge.util.encode64(cipher.output.getBytes());
}

export function decrypt(encrypted64) {
  const encrypted = forge.util.decode64(encrypted64);

  const decipher = forge.cipher.createDecipher("AES-CBC", KEY);
  decipher.start({ iv: IV });
  decipher.update(forge.util.createBuffer(encrypted));
  decipher.finish();

  return decipher.output.data;
}
