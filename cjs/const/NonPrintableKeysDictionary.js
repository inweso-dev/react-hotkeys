"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dictionaryFrom = _interopRequireDefault(require("../utils/object/dictionaryFrom"));

var _translateToKey = _interopRequireDefault(require("../vendor/react-dom/translateToKey"));

var _values = _interopRequireDefault(require("../utils/object/values"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Dictionary of keys whose name is not a single symbol or character
 */
var NonPrintableKeysDictionary = (0, _dictionaryFrom["default"])((0, _values["default"])(_translateToKey["default"]));
var _default = NonPrintableKeysDictionary;
exports["default"] = _default;