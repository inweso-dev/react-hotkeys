"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Encapsulates all logging behaviour and provides the ability to specify the level
 * of logging desired.
 * @class
 */
var Logger = /*#__PURE__*/function () {
  function Logger() {
    var logLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'warn';

    _classCallCheck(this, Logger);

    _defineProperty(this, "verbose", this.noop);

    _defineProperty(this, "debug", this.noop);

    _defineProperty(this, "info", this.noop);

    _defineProperty(this, "warn", this.noop);

    _defineProperty(this, "error", this.noop);

    this.logLevel = this.constructor.levels[logLevel];

    for (var _i = 0, _arr = ['error', 'warn', 'info', 'debug', 'verbose']; _i < _arr.length; _i++) {
      var level = _arr[_i];

      if (this.logLevel < this.constructor.levels[level]) {
        return;
      }

      this[level] = ['debug', 'verbose'].indexOf(level) === -1 ? console[level] : console.log;
    }
  }

  _createClass(Logger, [{
    key: "noop",
    value:
    /**
     * Icons prefixed to the start of logging statements that cycled through each
     * time a focus tree changes, making it easier to quickly spot events related
     * to the same focus tree.
     */

    /**
     * Icons prefixed to the start of logging statements that cycled through each
     * time a component ID changes, making it easier to quickly spot events related
     * to the same component.
     */

    /**
     * Icons prefixed to the start of logging statements that cycled through each
     * time an event ID changes, making it easier to quickly trace the path of KeyEvent
     * objects as they propagate through multiple components.
     */

    /**
     * The level of logging to perform
     * @typedef {'none'|'error'|'warn'|'info'|'debug'|'verbose'} LogLevel
     */

    /**
     * Levels of log severity - the higher the log level, the greater the amount (and
     * lesser the importance) of information logged to the console about React HotKey's
     * behaviour
     * @enum {number} LogLevel
     */
    function noop() {}
    /**
     * By default, calls to all log severities are a no-operation. It's only when the
     * user specifies a log level, are they replaced with logging statements
     * @type {Logger.noop}
     */

  }]);

  return Logger;
}();

_defineProperty(Logger, "logIcons", ['📕', '📗', '📘', '📙']);

_defineProperty(Logger, "componentIcons", ['🔺', '⭐️', '🔷', '🔶', '⬛️']);

_defineProperty(Logger, "eventIcons", ['❤️', '💚', '💙', '💛', '💜', '🧡']);

_defineProperty(Logger, "levels", {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  verbose: 5
});

var _default = Logger;
exports["default"] = _default;