"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resolveShiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveShiftedAlias"));

var _resolveUnshiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveUnshiftedAlias"));

var _KeyOSAndLayoutAliasesDictionary = _interopRequireDefault(require("../../const/KeyOSAndLayoutAliasesDictionary"));

var _KeySequenceParser = _interopRequireDefault(require("./KeySequenceParser"));

var _resolveUnaltedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveUnaltedAlias"));

var _resolveAltedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveAltedAlias"));

var _resolveUnaltShiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveUnaltShiftedAlias"));

var _resolveAltShiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveAltShiftedAlias"));

var _normalizedCombinationId = _interopRequireDefault(require("../../helpers/parsing-key-maps/normalizedCombinationId"));

var _size = _interopRequireDefault(require("../../utils/collection/size"));

var _distinct = _interopRequireDefault(require("../../utils/array/distinct"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function buildShiftedKeyAliases(combinationIncludesAlt, keyName) {
  if (combinationIncludesAlt) {
    return [].concat(_toConsumableArray((0, _resolveAltShiftedAlias["default"])(keyName)), _toConsumableArray((0, _resolveUnaltShiftedAlias["default"])(keyName)), [keyName]);
  } else {
    return [].concat(_toConsumableArray((0, _resolveShiftedAlias["default"])(keyName)), _toConsumableArray((0, _resolveUnshiftedAlias["default"])(keyName)), [keyName]);
  }
}

function buildAltKeyAliases(keyName) {
  return [].concat(_toConsumableArray((0, _resolveAltedAlias["default"])(keyName)), _toConsumableArray((0, _resolveUnaltedAlias["default"])(keyName)), [keyName]);
}

function buildOSAndKeyboardLayoutAliases(keyName) {
  var osAndLayoutAliases = _KeyOSAndLayoutAliasesDictionary["default"][keyName];

  if (osAndLayoutAliases) {
    return [keyName].concat(_toConsumableArray(osAndLayoutAliases));
  }

  return [keyName];
}

function buildKeyAliasList(keyCombination, keyName) {
  var combinationIncludesShift = keyCombination['Shift'];
  var combinationIncludesAlt = keyCombination['Alt'];

  var aliases = function () {
    if (combinationIncludesShift) {
      return buildShiftedKeyAliases(combinationIncludesAlt, keyName);
    } else if (combinationIncludesAlt) {
      return buildAltKeyAliases(keyName);
    } else {
      return buildOSAndKeyboardLayoutAliases(keyName);
    }
  }();

  return (0, _distinct["default"])(aliases);
}

function buildKeyCombinationPermutations(keyCombination) {
  return Object.keys(keyCombination).reduce(function (allCombinations, keyName) {
    var keyAliasList = buildKeyAliasList(keyCombination, keyName);

    if ((0, _size["default"])(allCombinations) === 0) {
      return keyAliasList.map(function (keyAlias) {
        return _defineProperty({}, keyAlias, true);
      });
    }

    return keyAliasList.reduce(function (keyAliasCombinations, keyAlias) {
      return keyAliasCombinations.concat(allCombinations.map(function (keyDictionary) {
        return _objectSpread(_objectSpread({}, keyDictionary), {}, _defineProperty({}, keyAlias, true));
      }));
    }, []);
  }, []);
}
/**
 * Serializes instances of KeyCombination to KeyCombinationString.
 *
 * Used primarily to serialize string representations of key events as they happen.
 * @class
 */


var KeyCombinationSerializer = /*#__PURE__*/function () {
  function KeyCombinationSerializer() {
    _classCallCheck(this, KeyCombinationSerializer);
  }

  _createClass(KeyCombinationSerializer, null, [{
    key: "serialize",
    value:
    /**
     * Returns a string representation of a single KeyCombination
     * @param {KeyCombination} keyCombination KeyCombination to serialize
     * @returns {string[]} Serialization of KeyCombination
     */
    function serialize(keyCombination) {
      /**
       * List of key names in alphabetical order
       * @type {string[]}
       */
      var combinationDictionary = buildKeyCombinationPermutations(keyCombination);
      return combinationDictionary.map(_normalizedCombinationId["default"]);
    }
    /**
     * Whether the specified key sequence is valid (is of the correct format and contains
     * combinations consisting entirely of valid keys)
     * @param {KeySequenceString} keySequence Key sequence to validate
     * @returns {boolean} Whether the key sequence is valid
     */

  }, {
    key: "isValidKeySerialization",
    value: function isValidKeySerialization(keySequence) {
      if (keySequence.length > 0) {
        return !!_KeySequenceParser["default"].parse(keySequence, {
          ensureValidKeys: true
        }).combination;
      } else {
        return false;
      }
    }
  }]);

  return KeyCombinationSerializer;
}();

var _default = KeyCombinationSerializer;
exports["default"] = _default;