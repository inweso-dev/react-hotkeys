function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

import isUndefined from '../../utils/isUndefined';
import KeyEventCounter from '../listening/KeyEventCounter';
import EventStrategyLogger from './EventStrategyLogger';
import describeKeyEvent from '../../helpers/logging/describeKeyEvent';

var FocusOnlyLogger = /*#__PURE__*/function (_EventStrategyLogger) {
  _inherits(FocusOnlyLogger, _EventStrategyLogger);

  var _super = _createSuper(FocusOnlyLogger);

  function FocusOnlyLogger() {
    _classCallCheck(this, FocusOnlyLogger);

    return _super.apply(this, arguments);
  }

  _createClass(FocusOnlyLogger, [{
    key: "keyEventPrefix",
    value: function keyEventPrefix(componentId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var logIcons = _get(_getPrototypeOf(FocusOnlyLogger.prototype), "constructor", this).logIcons;

      var eventIcons = _get(_getPrototypeOf(FocusOnlyLogger.prototype), "constructor", this).eventIcons;

      var componentIcons = _get(_getPrototypeOf(FocusOnlyLogger.prototype), "constructor", this).componentIcons;

      var base = 'HotKeys (';

      if (options.focusTreeId !== false) {
        var focusTreeId = isUndefined(options.focusTreeId) ? this._eventStrategy.focusTreeId : options.focusTreeId;
        base += "F".concat(focusTreeId).concat(logIcons[focusTreeId % logIcons.length], "-");
      }

      base += "C".concat(componentId).concat(componentIcons[componentId % componentIcons.length]);

      var position = this._eventStrategy.componentList.getPositionById(componentId);

      if (!isUndefined(position)) {
        base += "-P".concat(position).concat(componentIcons[position % componentIcons.length]);
      }

      if (options.eventId !== false) {
        var eventId = isUndefined(options.eventId) ? KeyEventCounter.id : options.eventId;
        base += "-E".concat(eventId).concat(eventIcons[eventId % eventIcons.length]);
      }

      return "".concat(base, "):");
    }
  }, {
    key: "logIgnoredKeyEvent",
    value: function logIgnoredKeyEvent(event, key, eventType, reason, componentId) {
      this.logIgnoredEvent(describeKeyEvent(event, key, eventType), reason, componentId);
    }
  }, {
    key: "logIgnoredEvent",
    value: function logIgnoredEvent(eventDescription, reason, componentId) {
      this.debug(this.keyEventPrefix(componentId), "Ignored ".concat(eventDescription, " because ").concat(reason, "."));
    }
  }, {
    key: "logAlreadySimulatedEvent",
    value: function logAlreadySimulatedEvent(event, key, eventType, componentId) {
      this.logIgnoredKeyEvent(event, key, eventType, 'it was not expected, and has already been simulated', componentId);
    }
  }]);

  return FocusOnlyLogger;
}(EventStrategyLogger);

export default FocusOnlyLogger;