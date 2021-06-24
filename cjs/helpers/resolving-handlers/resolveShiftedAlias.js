"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ShiftedKeysDictionary = _interopRequireDefault(require("../../const/ShiftedKeysDictionary"));

var _fallbackToTransformedSelf = _interopRequireDefault(require("./fallbackToTransformedSelf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Returns the corresponding symbol or character for a particular key, when it is
 * pressed with the shift key also held down
 * @param {NormalizedKeyName} keyName Name of the key
 * @returns {ReactKeyName[]} Symbol or character for the key, when it is pressed with the
 *          shift key
 */
function resolveShiftedAlias(keyName) {
  return (0, _fallbackToTransformedSelf["default"])(_ShiftedKeysDictionary["default"], keyName, 'toUpperCase');
}

var _default = resolveShiftedAlias;
exports["default"] = _default;