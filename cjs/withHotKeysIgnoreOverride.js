"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _KeyEventManager = _interopRequireDefault(require("./lib/KeyEventManager"));

var _arrayFrom = _interopRequireDefault(require("./utils/array/arrayFrom"));

var _standardizeKeyName = _interopRequireDefault(require("./helpers/parsing-key-maps/standardizeKeyName"));

var _isValidKey = _interopRequireWildcard(require("./helpers/parsing-key-maps/isValidKey"));

var _isEmpty = _interopRequireDefault(require("./utils/collection/isEmpty"));

var _resolveAltShiftedAlias = _interopRequireDefault(require("./helpers/resolving-handlers/resolveAltShiftedAlias"));

var _resolveUnaltShiftedAlias = _interopRequireDefault(require("./helpers/resolving-handlers/resolveUnaltShiftedAlias"));

var _resolveShiftedAlias = _interopRequireDefault(require("./helpers/resolving-handlers/resolveShiftedAlias"));

var _resolveUnshiftedAlias = _interopRequireDefault(require("./helpers/resolving-handlers/resolveUnshiftedAlias"));

var _resolveAltedAlias = _interopRequireDefault(require("./helpers/resolving-handlers/resolveAltedAlias"));

var _resolveUnaltedAlias = _interopRequireDefault(require("./helpers/resolving-handlers/resolveUnaltedAlias"));

var _hasKey = _interopRequireDefault(require("./utils/object/hasKey"));

var _dictionaryFrom = _interopRequireDefault(require("./utils/object/dictionaryFrom"));

var _HotKeysIgnoreOverrideManager = _interopRequireDefault(require("./lib/metal/HotKeysIgnoreOverrideManager"));

var _excluded = ["only", "except"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var propTypes = {
  /**
   * The whitelist of keys that keyevents should be ignored. i.e. if you place
   * a key in this list, all events related to it will be ignored by react hotkeys
   */
  only: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)]),

  /**
   * The blacklist of keys that keyevents should be not ignored. i.e. if you place
   * a key in this list, all events related to it will be still be observed by react
   * hotkeys
   */
  except: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)])
};
/**
 * Wraps a React component in a HotKeysIgnoreOverride component, which passes down the
 * callbacks and options necessary for React Hotkeys to work as a single prop value,
 * hotkeys. These must be unwrapped and applied to a DOM-mountable element within
 * the wrapped component (e.g. div, span, input, etc) in order for the key events
 * to be recorded.
 *
 * @param {React.ComponentClass} Component - Component class to wrap
 * @param {Object} hotKeysIgnoreOptions - Options that become the wrapping component's
 *                 default prop values
 * @param {string} eventManagerMethod - Name of EventManager method to use to handle a
 *        key event
 * @returns {React.ComponentClass} Wrapped component that is passed all of the React
 * hotkeys props in a single value, hotkeys.
 */

function withHotKeysIgnoreOverride(Component) {
  var _class, _temp;

  var hotKeysIgnoreOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    only: [],
    except: []
  };
  var eventManagerMethod = arguments.length > 2 ? arguments[2] : undefined;

  /**
   * A component that causes React Hotkeys to ignore the results of
   * Configuration.ignoreEventCondition and instead either force the event to be
   * ignored or observed. By default, this is all key events, but you can use
   * the only prop to provide a whitelist, or the except prop to pass a blacklist.
   * @class
   */
  return _temp = _class = /*#__PURE__*/function (_PureComponent) {
    _inherits(HotKeysIgnoreOverride, _PureComponent);

    var _super = _createSuper(HotKeysIgnoreOverride);

    function HotKeysIgnoreOverride(props) {
      var _this;

      _classCallCheck(this, HotKeysIgnoreOverride);

      _this = _super.call(this, props);
      _this._manager = new _HotKeysIgnoreOverrideManager["default"](eventManagerMethod);
      return _this;
    }

    _createClass(HotKeysIgnoreOverride, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            only = _this$props.only,
            except = _this$props.except,
            props = _objectWithoutProperties(_this$props, _excluded);

        return /*#__PURE__*/_react["default"].createElement(Component, _extends({
          hotKeys: this._manager.getComponentProps(function () {
            return _this2.props;
          })
        }, props));
      }
    }]);

    return HotKeysIgnoreOverride;
  }(_react.PureComponent), _defineProperty(_class, "propTypes", propTypes), _defineProperty(_class, "defaultProps", hotKeysIgnoreOptions), _temp;
}

var _default = withHotKeysIgnoreOverride;
exports["default"] = _default;