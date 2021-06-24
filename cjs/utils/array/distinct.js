"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dictionaryFrom = _interopRequireDefault(require("../object/dictionaryFrom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function distinct(array) {
  return Object.keys((0, _dictionaryFrom["default"])(array));
}

var _default = distinct;
exports["default"] = _default;