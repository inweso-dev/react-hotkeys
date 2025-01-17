"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resolveAltShiftedAlias = _interopRequireDefault(require("./resolveAltShiftedAlias"));

var _resolveUnaltShiftedAlias = _interopRequireDefault(require("./resolveUnaltShiftedAlias"));

var _resolveShiftedAlias = _interopRequireDefault(require("./resolveShiftedAlias"));

var _resolveUnshiftedAlias = _interopRequireDefault(require("./resolveUnshiftedAlias"));

var _resolveAltedAlias = _interopRequireDefault(require("./resolveAltedAlias"));

var _resolveUnaltedAlias = _interopRequireDefault(require("./resolveUnaltedAlias"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function applicableAliasFunctions(keyDictionary) {
  if (keyDictionary['Shift']) {
    if (keyDictionary['Alt']) {
      return [_resolveAltShiftedAlias["default"], _resolveUnaltShiftedAlias["default"]];
    }

    return [_resolveShiftedAlias["default"], _resolveUnshiftedAlias["default"]];
  }

  if (keyDictionary['Alt']) {
    return [_resolveAltedAlias["default"], _resolveUnaltedAlias["default"]];
  }

  return [nop, nop];
}

function nop(keyName) {
  return [keyName];
}

var _default = applicableAliasFunctions;
exports["default"] = _default;