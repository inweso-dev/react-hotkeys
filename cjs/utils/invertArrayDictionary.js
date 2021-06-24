"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hasKey = _interopRequireDefault(require("./object/hasKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function invertArrayDictionary(dictionary) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.keys(dictionary).reduce(function (memo, key) {
    var arrayValue = dictionary[key];
    arrayValue.forEach(function (shiftedKey) {
      if (!(0, _hasKey["default"])(memo, shiftedKey)) {
        memo[shiftedKey] = [];
      }

      memo[shiftedKey].push(key);
    });

    if (options.includeOriginal) {
      if (!(0, _hasKey["default"])(memo, key)) {
        memo[key] = [];
      }

      memo[key] = [].concat(_toConsumableArray(memo[key]), _toConsumableArray(arrayValue));
    }

    return memo;
  }, {});
}

var _default = invertArrayDictionary;
exports["default"] = _default;