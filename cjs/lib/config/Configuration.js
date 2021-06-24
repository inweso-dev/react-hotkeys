"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dictionaryFrom = _interopRequireDefault(require("../../utils/object/dictionaryFrom"));

var _values = _interopRequireDefault(require("../../utils/object/values"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Default configuration values
 * @private
 */
var _defaultConfiguration = {
  /**
   * The level of logging of its own behaviour React HotKeys should perform.
   * @type {LogLevel}
   */
  logLevel: 'warn',

  /**
   * Default key event key maps are bound to, if left unspecified
   * @type {KeyEventName}
   */
  defaultKeyEvent: 'keydown',

  /**
   * The default component type to wrap HotKey components' children in, to provide
   * the required focus and keyboard event listening for HotKeys to function
   */
  defaultComponent: 'div',

  /**
   * The default tabIndex value passed to the wrapping component used to contain
   * HotKey components' children. -1 skips focusing the element when tabbing through
   * the DOM, but allows focusing programmatically.
   */
  defaultTabIndex: '-1',

  /**
   * The HTML tags that React HotKeys should ignore key events from. This only works
   * if you are using the default ignoreEventsCondition function.
   * @type {String[]}
   */
  ignoreTags: ['input', 'select', 'textarea'],

  /**
   * Whether to ignore changes to keyMap and handlers props by default (this reduces
   * a significant amount of unnecessarily resetting internal state)
   *
   * @type {boolean}
   */
  ignoreKeymapAndHandlerChangesByDefault: true,

  /**
   * The function used to determine whether a key event should be ignored by React
   * Hotkeys. By default, keyboard events originating elements with a tag name in
   * ignoreTags, or a isContentEditable property of true, are ignored.
   *
   * @type {Function<KeyboardEvent>}
   */
  ignoreEventsCondition: function ignoreEventsCondition(event) {
    var target = event.target;

    if (target && target.tagName) {
      var tagName = target.tagName.toLowerCase();
      return Configuration.option('_ignoreTagsDict')[tagName] || target.isContentEditable;
    } else {
      return false;
    }
  },

  /**
   * Whether to ignore repeated keyboard events when a key is being held down
   * @type {boolean}
   */
  ignoreRepeatedEventsWhenKeyHeldDown: true,

  /**
   * Whether React HotKeys should simulate keypress events for the keys that do not
   * natively emit them.
   * @type {boolean}
   */
  simulateMissingKeyPressEvents: true,

  /**
   * Whether to call stopPropagation() on events after they are handled (preventing
   * the event from bubbling up any further, both within React Hotkeys and any other
   * event listeners bound in React).
   *
   * This does not affect the behaviour of React Hotkeys, but rather what happens to
   * the event once React Hotkeys is done with it (whether it's allowed to propagate
   * any further through the Render tree).
   * @type {boolean}
   */
  stopEventPropagationAfterHandling: true,

  /**
   * Whether to call stopPropagation() on events after they are ignored (preventing
   * the event from bubbling up any further, both within React Hotkeys and any other
   * event listeners bound in React).
   *
   * This does not affect the behaviour of React Hotkeys, but rather what happens to
   * the event once React Hotkeys is done with it (whether it's allowed to propagate
   * any further through the Render tree).
   * @type {boolean}
   */
  stopEventPropagationAfterIgnoring: true,

  /**
   * Whether to allow combination submatches - e.g. if there is an action bound to
   * cmd, pressing shift+cmd will *not* trigger that action when
   * allowCombinationSubmatches is false.
   *
   * @note This option is ignored for combinations involving command (Meta) and
   *      submatches are <i>always</i> allowed because Meta hides keyup events
   *      of other keys, so until Command is released, it's impossible to know
   *      if one of the keys that has also been pressed has been released.
   *      @see https://github.com/greena13/react-hotkeys/pull/207
   * @type {boolean}
   */
  allowCombinationSubmatches: false,

  /**
   * A mapping of custom key codes to key names that you can then use in your
   * key sequences
   * @type {Object.<Number, KeyName>}
   */
  customKeyCodes: {}
};

var _configuration = _objectSpread({}, _defaultConfiguration);
/**
 * Turn our array of tags to ignore into a dictionary, for faster lookup
 */


_configuration._ignoreTagsDict = (0, _dictionaryFrom["default"])(_configuration.ignoreTags);
/**
 * Handles getting and setting global configuration values, that affect how
 * React Hotkeys behaves
 * @class
 */

var Configuration = /*#__PURE__*/function () {
  function Configuration() {
    _classCallCheck(this, Configuration);
  }

  _createClass(Configuration, null, [{
    key: "init",
    value:
    /**
     * Merges the specified configuration options with the current values.
     * @see _configuration
     */
    function init(configuration) {
      var _this = this;

      var ignoreTags = configuration.ignoreTags,
          customKeyCodes = configuration.customKeyCodes;

      if (ignoreTags) {
        configuration._ignoreTagsDict = (0, _dictionaryFrom["default"])(configuration.ignoreTags);
      }

      if (customKeyCodes) {
        configuration._customKeyNamesDict = (0, _dictionaryFrom["default"])((0, _values["default"])(configuration.customKeyCodes));
      } // noinspection JSUnresolvedVariable


      if (false) {
        if (['verbose', 'debug', 'info'].indexOf(configuration.logLevel) !== -1) {
          console.warn("React HotKeys: You have requested log level '".concat(configuration.logLevel, "' but for performance reasons, logging below severity level 'warning' is disabled in production. Please use the development build for complete logs."));
        }
      }

      Object.keys(configuration).forEach(function (key) {
        _this.set(key, configuration[key]);
      });
    }
    /**
     * Sets a single configuration value by name
     * @param {string} key - Name of the configuration value to set
     * @param {*} value - New value to set
     */

  }, {
    key: "set",
    value: function set(key, value) {
      _configuration[key] = value;
    }
  }, {
    key: "reset",
    value: function reset(key) {
      _configuration[key] = _defaultConfiguration[key];
    }
    /**
     * Gets a single configuration value by name
     * @param {string} key - Name of the configuration value
     * @returns {*} Configuration value
     */

  }, {
    key: "option",
    value: function option(key) {
      return _configuration[key];
    }
  }]);

  return Configuration;
}();

var _default = Configuration;
exports["default"] = _default;