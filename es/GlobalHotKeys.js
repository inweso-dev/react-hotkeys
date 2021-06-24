function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

import PropTypes from 'prop-types';
import { Component } from 'react';
import backwardsCompatibleContext from './utils/backwardsCompatibleContext';
import GlobalComponentManager from './lib/metal/GlobalComponentManager';

var GlobalHotKeys = /*#__PURE__*/function (_Component) {
  _inherits(GlobalHotKeys, _Component);

  var _super = _createSuper(GlobalHotKeys);

  function GlobalHotKeys(props) {
    var _this;

    _classCallCheck(this, GlobalHotKeys);

    _this = _super.call(this, props);
    _this._manager = new GlobalComponentManager(props.keyMap);
    return _this;
  }

  _createClass(GlobalHotKeys, [{
    key: "render",
    value: function render() {
      return this.props.children || null;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._manager.addHotKeys(this.props, this.context);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this._manager.updateHotKeys(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._manager.removeKeyMap();
    }
  }]);

  return GlobalHotKeys;
}(Component);

_defineProperty(GlobalHotKeys, "propTypes", {
  /**
   * A map from action names to Mousetrap or Browser key sequences
   * @type {KeyMap}
   */
  keyMap: PropTypes.object,

  /**
   * A map from action names to event handler functions
   * @typedef {Object.<ActionName, Function>} HandlersMap
   */

  /**
   * A map from action names to event handler functions
   * @type {HandlersMap}
   */
  handlers: PropTypes.object,

  /**
   * Whether the keyMap or handlers are permitted to change after the
   * component mounts. If false, changes to the keyMap and handlers
   * props will be ignored
   */
  allowChanges: PropTypes.bool
});

export default backwardsCompatibleContext(GlobalHotKeys, {
  deprecatedAPI: {
    contextTypes: {
      globalHotKeysParentId: PropTypes.number
    },
    childContextTypes: {
      globalHotKeysParentId: PropTypes.number
    }
  },
  newAPI: {
    contextType: {
      globalHotKeysParentId: undefined
    }
  }
});