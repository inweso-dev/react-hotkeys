"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ModifierFlagsDictionary = _interopRequireDefault(require("../../const/ModifierFlagsDictionary"));

var _hasKeyPressEvent = _interopRequireDefault(require("../../helpers/resolving-handlers/hasKeyPressEvent"));

var _KeyEventType = _interopRequireDefault(require("../../const/KeyEventType"));

var _keyupIsHiddenByCmd = _interopRequireDefault(require("../../helpers/resolving-handlers/keyupIsHiddenByCmd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AbstractKeyEventSimulator = /*#__PURE__*/function () {
  function AbstractKeyEventSimulator(keyEventStrategy) {
    _classCallCheck(this, AbstractKeyEventSimulator);

    this._keyEventStrategy = keyEventStrategy;
    this.clear();
  }

  _createClass(AbstractKeyEventSimulator, [{
    key: "clear",
    value: function clear() {
      this.keypressEventsToSimulate = [];
      this.keyupEventsToSimulate = [];
    }
  }, {
    key: "cloneAndMergeEvent",
    value: function cloneAndMergeEvent(event, extra) {
      var eventAttributes = Object.keys(_ModifierFlagsDictionary["default"]).reduce(function (memo, eventAttribute) {
        memo[eventAttribute] = event[eventAttribute];
        return memo;
      }, {});
      return _objectSpread(_objectSpread({}, eventAttributes), extra);
    }
  }, {
    key: "_shouldSimulate",
    value: function _shouldSimulate(eventType, keyName) {
      var keyHasNativeKeyPress = (0, _hasKeyPressEvent["default"])(keyName);
      var currentCombination = this._keyEventStrategy.currentCombination;

      if (eventType === _KeyEventType["default"].keypress) {
        return !keyHasNativeKeyPress || keyHasNativeKeyPress && currentCombination.isKeyStillPressed('Meta');
      } else if (eventType === _KeyEventType["default"].keyup) {
        return (0, _keyupIsHiddenByCmd["default"])(keyName) && currentCombination.isKeyReleased('Meta');
      }

      return false;
    }
  }]);

  return AbstractKeyEventSimulator;
}();

var _default = AbstractKeyEventSimulator;
exports["default"] = _default;