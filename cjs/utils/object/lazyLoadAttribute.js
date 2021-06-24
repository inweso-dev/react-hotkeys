"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function lazyLoadAttribute(target, attributeName, definition) {
  if (!target[attributeName]) {
    target[attributeName] = typeof definition === 'function' ? definition() : definition;
  }

  return target[attributeName];
}

var _default = lazyLoadAttribute;
exports["default"] = _default;