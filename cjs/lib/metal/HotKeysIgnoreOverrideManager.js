"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _KeyEventManager = _interopRequireDefault(require("../KeyEventManager"));

var _isEmpty = _interopRequireDefault(require("../../utils/collection/isEmpty"));

var _hasKey = _interopRequireDefault(require("../../utils/object/hasKey"));

var _arrayFrom = _interopRequireDefault(require("../../utils/array/arrayFrom"));

var _standardizeKeyName = _interopRequireDefault(require("../../helpers/parsing-key-maps/standardizeKeyName"));

var _isValidKey = _interopRequireWildcard(require("../../helpers/parsing-key-maps/isValidKey"));

var _dictionaryFrom = _interopRequireDefault(require("../../utils/object/dictionaryFrom"));

var _resolveAltShiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveAltShiftedAlias"));

var _resolveUnaltShiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveUnaltShiftedAlias"));

var _resolveShiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveShiftedAlias"));

var _resolveUnshiftedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveUnshiftedAlias"));

var _resolveAltedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveAltedAlias"));

var _resolveUnaltedAlias = _interopRequireDefault(require("../../helpers/resolving-handlers/resolveUnaltedAlias"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HotKeysIgnoreOverrideManager = /*#__PURE__*/function () {
  function HotKeysIgnoreOverrideManager(eventManagerMethod) {
    _classCallCheck(this, HotKeysIgnoreOverrideManager);

    this._handleKeyEvent = this._handleKeyEvent.bind(this);
    this._eventManagerMethod = eventManagerMethod;
  }

  _createClass(HotKeysIgnoreOverrideManager, [{
    key: "getComponentProps",
    value: function getComponentProps(accessor) {
      var _this = this;

      return {
        onKeyDown: this._handleKeyEvent,
        onKeyPress: this._handleKeyEvent,
        onKeyUp: this._handleKeyEvent,
        onFocus: function onFocus() {
          return _this._reloadDictionaries(accessor());
        }
      };
    }
  }, {
    key: "_reloadDictionaries",
    value: function _reloadDictionaries(_ref) {
      var only = _ref.only,
          except = _ref.except;
      this._onlyDict = keyDictionary(only);
      this._exceptDict = keyDictionary(except);
    }
  }, {
    key: "_handleKeyEvent",
    value: function _handleKeyEvent(event) {
      if (this._shouldIgnoreEvent(event)) {
        _KeyEventManager["default"].getInstance()[this._eventManagerMethod](event);
      }
    }
  }, {
    key: "_shouldIgnoreEvent",
    value: function _shouldIgnoreEvent(_ref2) {
      var key = _ref2.key;

      if ((0, _isEmpty["default"])(this._onlyDict)) {
        if ((0, _isEmpty["default"])(this._exceptDict)) {
          return true;
        }

        return !(0, _hasKey["default"])(this._exceptDict, key);
      }

      if ((0, _isEmpty["default"])(this._exceptDict)) {
        return (0, _hasKey["default"])(this._onlyDict, key);
      }

      return (0, _hasKey["default"])(this._onlyDict, key) && !(0, _hasKey["default"])(this._exceptDict, key);
    }
  }]);

  return HotKeysIgnoreOverrideManager;
}();

function keyDictionary(list) {
  return (0, _arrayFrom["default"])(list).reduce(function (memo, keyName) {
    var finalKeyName = (0, _standardizeKeyName["default"])(keyName);

    if (!(0, _isValidKey["default"])(finalKeyName)) {
      throw new _isValidKey.InvalidKeyNameError(keyName);
    }

    (0, _dictionaryFrom["default"])([_resolveAltShiftedAlias["default"], _resolveUnaltShiftedAlias["default"], _resolveShiftedAlias["default"], _resolveUnshiftedAlias["default"], _resolveAltedAlias["default"], _resolveUnaltedAlias["default"]], true, function (func) {
      return func(finalKeyName);
    }, memo);
    return memo;
  }, {});
}

var _default = HotKeysIgnoreOverrideManager;
exports["default"] = _default;