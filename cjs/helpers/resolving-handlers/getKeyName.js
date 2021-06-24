"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactsGetEventKey = _interopRequireDefault(require("../../vendor/react-dom/reactsGetEventKey"));

var _Configuration = _interopRequireDefault(require("../../lib/config/Configuration"));

var _hasKey = _interopRequireDefault(require("../../utils/object/hasKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Lowercased string representing a particular keyboard key
 * @typedef {string} NormalizedKeyName
 */
function keyNameFromEvent(event) {
  var customKeyCodes = _Configuration["default"].option('customKeyCodes'); // noinspection JSDeprecatedSymbols


  var keyCode = event.keyCode || event.charCode;

  if ((0, _hasKey["default"])(customKeyCodes, keyCode)) {
    return customKeyCodes[keyCode];
  }

  if (event.nativeEvent) {
    return event.key;
  } else {
    return (0, _reactsGetEventKey["default"])(event);
  }
}
/**
 * Returns key name from native or React keyboard event
 * @param {SyntheticKeyboardEvent} event - Event containing the key name
 * @returns {NormalizedKeyName} Normalized name of the key
 */


function getKeyName(event) {
  var keyName = keyNameFromEvent(event);
  return keyName === '+' ? 'plus' : keyName;
}

var _default = getKeyName;
exports["default"] = _default;