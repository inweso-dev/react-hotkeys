"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isUndefined = _interopRequireDefault(require("../../utils/isUndefined"));

var _KeyEventCounter = _interopRequireDefault(require("../listening/KeyEventCounter"));

var _EventStrategyLogger2 = _interopRequireDefault(require("./EventStrategyLogger"));

var _describeKeyEvent = _interopRequireDefault(require("../../helpers/logging/describeKeyEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var GlobalLogger = /*#__PURE__*/function (_EventStrategyLogger) {
  _inherits(GlobalLogger, _EventStrategyLogger);

  var _super = _createSuper(GlobalLogger);

  function GlobalLogger() {
    _classCallCheck(this, GlobalLogger);

    return _super.apply(this, arguments);
  }

  _createClass(GlobalLogger, [{
    key: "keyEventPrefix",
    value: function keyEventPrefix(componentId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var eventIcons = _get(_getPrototypeOf(GlobalLogger.prototype), "constructor", this).eventIcons;

      var componentIcons = _get(_getPrototypeOf(GlobalLogger.prototype), "constructor", this).componentIcons;

      var base = 'HotKeys (GLOBAL';

      if (!(0, _isUndefined["default"])(componentId)) {
        return "".concat(base, "-C").concat(componentId).concat(componentIcons[componentId % componentIcons.length], "):");
      }

      if (options.eventId === false) {
        return "".concat(base, "):");
      } else {
        var eventId = (0, _isUndefined["default"])(options.eventId) ? _KeyEventCounter["default"].id : options.eventId;
        return "".concat(base, "-E").concat(eventId).concat(eventIcons[eventId % eventIcons.length], "):");
      }
    }
  }, {
    key: "logIgnoredKeyEvent",
    value: function logIgnoredKeyEvent(event, key, eventType, reason, componentId) {
      this.logIgnoredEvent((0, _describeKeyEvent["default"])(event, key, eventType), reason, componentId);
    }
  }, {
    key: "logIgnoredEvent",
    value: function logIgnoredEvent(eventDescription, reason, componentId) {
      this.debug(this.keyEventPrefix(componentId), "Ignored ".concat(eventDescription, " because ").concat(reason, "."));
    }
  }, {
    key: "logEventRejectedByFilter",
    value: function logEventRejectedByFilter(event, key, eventType, componentId) {
      this.logIgnoredKeyEvent(event, key, eventType, 'ignoreEventsFilter rejected it', componentId);
    }
  }, {
    key: "logEventAlreadySimulated",
    value: function logEventAlreadySimulated(event, key, eventType, componentId) {
      this.logIgnoredKeyEvent(event, key, eventType, 'it was not expected, and has already been simulated', componentId);
    }
  }]);

  return GlobalLogger;
}(_EventStrategyLogger2["default"]);

var _default = GlobalLogger;
exports["default"] = _default;