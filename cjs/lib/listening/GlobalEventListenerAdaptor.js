"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _KeyEventType = _interopRequireDefault(require("../../const/KeyEventType"));

var _describeKeyEventType = _interopRequireDefault(require("../../helpers/logging/describeKeyEventType"));

var _normalizeEventName = _interopRequireDefault(require("../../utils/string/normalizeEventName"));

var _values = _interopRequireDefault(require("../../utils/object/values"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GlobalEventListenerAdaptor = /*#__PURE__*/function () {
  function GlobalEventListenerAdaptor(strategy, _ref) {
    var logger = _ref.logger;

    _classCallCheck(this, GlobalEventListenerAdaptor);

    /**
     * Whether the global key event handlers have been bound to document yet or not
     * @type {boolean}
     */
    this._listenersBound = false;
    this.logger = logger;
    this._eventStrategy = strategy;
  }

  _createClass(GlobalEventListenerAdaptor, [{
    key: "isListenersBound",
    value: function isListenersBound() {
      return this._listenersBound;
    }
  }, {
    key: "unbindListeners",
    value: function unbindListeners() {
      var _this = this;

      (0, _values["default"])(_KeyEventType["default"]).forEach(function (recordIndex) {
        var eventName = (0, _describeKeyEventType["default"])(recordIndex);
        delete document["on".concat(eventName)];

        _this._logHandlerStateChange("Removed", eventName);
      });
      this._listenersBound = false;
    }
  }, {
    key: "bindListeners",
    value: function bindListeners() {
      var _this2 = this;

      (0, _values["default"])(_KeyEventType["default"]).forEach(function (recordIndex) {
        var eventName = (0, _describeKeyEventType["default"])(recordIndex);

        document["on".concat(eventName)] = function (keyEvent) {
          _this2._eventStrategy["handle".concat((0, _normalizeEventName["default"])(eventName))](keyEvent);
        };

        _this2._logHandlerStateChange("Bound", eventName);
      });
      this._listenersBound = true;
    }
  }, {
    key: "_logHandlerStateChange",
    value: function _logHandlerStateChange(action, eventName) {
      this.logger.debug(this.logger.nonKeyEventPrefix(undefined, {
        eventId: false
      }), "".concat(action, " handler handleGlobal").concat((0, _normalizeEventName["default"])(eventName), "() to document.on").concat(eventName, "()"));
    }
  }]);

  return GlobalEventListenerAdaptor;
}();

var _default = GlobalEventListenerAdaptor;
exports["default"] = _default;