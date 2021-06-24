"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function fallbackToTransformedSelf(dictionary, keyName, transformMethod) {
  return dictionary[keyName] || [keyName.length === 1 ? keyName[transformMethod]() : keyName];
}

var _default = fallbackToTransformedSelf;
exports["default"] = _default;