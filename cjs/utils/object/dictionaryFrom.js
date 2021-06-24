"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _arrayFrom = _interopRequireDefault(require("../array/arrayFrom"));

var _nop = _interopRequireDefault(require("../function/nop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @callback DictionaryKeyAdaptor
 * Adapts values to be used as keys in a dictionary
 * @param {*} value to adapt
 * @returns {*} The adapted value to use as a dictionary key
 */

/**
 * Create a dictionary (map) from an array of values
 * @param {*[]} array Array of values
 * @param {function|*} valueOrAdaptor Function to call on each element in the array to
 *        set the value in the dictionary, or a constant value that all keys in the
 *        dictionary should have
 * @param {DictionaryKeyAdaptor} keyAdaptor Function to call on each element
 * @param {Object} initValue Initial value of the dictionary to add the new entries to
 * @returns {Object.<*,*>} Dictionary created from array elements
 */
function dictionaryFrom(array) {
  var valueOrAdaptor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var keyAdaptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _nop["default"];
  var initValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var _valueAdaptor = function () {
    if (typeof valueOrAdaptor === 'function') {
      return valueOrAdaptor;
    }

    return function () {
      return valueOrAdaptor;
    };
  }();

  return (0, _arrayFrom["default"])(array).reduce(function (memo, element) {
    memo[keyAdaptor(element)] = _valueAdaptor(element);
    return memo;
  }, initValue);
}

var _default = dictionaryFrom;
exports["default"] = _default;