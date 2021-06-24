function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import KeyEventType from '../../const/KeyEventType';
import describeKeyEventType from '../../helpers/logging/describeKeyEventType';
import normalizeEventName from '../../utils/string/normalizeEventName';
import objectValues from '../../utils/object/values';

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

      objectValues(KeyEventType).forEach(function (recordIndex) {
        var eventName = describeKeyEventType(recordIndex);
        delete document["on".concat(eventName)];

        _this._logHandlerStateChange("Removed", eventName);
      });
      this._listenersBound = false;
    }
  }, {
    key: "bindListeners",
    value: function bindListeners() {
      var _this2 = this;

      objectValues(KeyEventType).forEach(function (recordIndex) {
        var eventName = describeKeyEventType(recordIndex);

        document["on".concat(eventName)] = function (keyEvent) {
          _this2._eventStrategy["handle".concat(normalizeEventName(eventName))](keyEvent);
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
      }), "".concat(action, " handler handleGlobal").concat(normalizeEventName(eventName), "() to document.on").concat(eventName, "()"));
    }
  }]);

  return GlobalEventListenerAdaptor;
}();

export default GlobalEventListenerAdaptor;