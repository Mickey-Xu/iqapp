/**
 * Copyright (C) 2016 All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are not permitted unless explicitly granted in writing.
 *
 * Usage and modification rights granted to Schindler AG, Ebikon.
 */

export default {
  serialize() {
    throw new Error("sectionBreak serializer called");
  },

  canDeserialize(node) {
    return false;
  },

  deserialize(node) {
    throw new Error("sectionBreak deserializer called");
  },
};
