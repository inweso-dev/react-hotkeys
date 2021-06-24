"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Configuration = _interopRequireDefault(require("../config/Configuration"));

var _isUndefined = _interopRequireDefault(require("../../utils/isUndefined"));

var _KeyEventManager = _interopRequireDefault(require("../KeyEventManager"));

var _isEmpty = _interopRequireDefault(require("../../utils/collection/isEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function wrapPropInFunction(prop, func) {
  if (typeof prop === 'function') {
    return function (event) {
      prop(event);
      func(event);
    };
  } else {
    return func;
  }
}

function getComponentOptions() {
  return {
    defaultKeyEvent: _Configuration["default"].option('defaultKeyEvent')
  };
}

function getEventOptions() {
  return {
    ignoreEventsCondition: _Configuration["default"].option('ignoreEventsCondition')
  };
}

var FocusOnlyComponentManager = /*#__PURE__*/function () {
  function FocusOnlyComponentManager(hotKeysOptions, _ref) {
    var keyMap = _ref.keyMap;

    _classCallCheck(this, FocusOnlyComponentManager);

    this._hotKeysOptions = hotKeysOptions;
    this.id = _KeyEventManager["default"].getFocusOnlyEventStrategy().registerKeyMap(keyMap);
    /**
     * We maintain a separate instance variable to contain context that will be
     * passed down to descendants of this component so we can have a consistent
     * reference to the same object, rather than instantiating a new one on each
     * render, causing unnecessary re-rendering of descendant components that
     * consume the context.
     *
     * @see https://reactjs.org/docs/context.html#caveats
     */

    this.childContext = {
      hotKeysParentId: this.id
    };
    this._focusTreeIds = [];
  }

  _createClass(FocusOnlyComponentManager, [{
    key: "focusTreeId",
    get: function get() {
      return this._focusTreeIds[0];
    }
  }, {
    key: "getComponentProps",
    value: function getComponentProps(props) {
      var _this = this;

      var componentProps = {
        onFocus: wrapPropInFunction(props.onFocus, function () {
          return _this.enableHotKeys(props);
        }),
        onBlur: wrapPropInFunction(props.onBlur, function () {
          return _this.disableHotKeys(props);
        }),
        tabIndex: _Configuration["default"].option('defaultTabIndex')
      };

      if (this._shouldBindKeyListeners(props)) {
        componentProps.onKeyDown = function (event) {
          return _this._delegateEventToManager(event, 'handleKeyDown');
        };

        componentProps.onKeyPress = function (event) {
          return _this._delegateEventToManager(event, 'handleKeyPress');
        };

        componentProps.onKeyUp = function (event) {
          return _this._delegateEventToManager(event, 'handleKeyUp');
        };
      }

      return componentProps;
    }
  }, {
    key: "_shouldBindKeyListeners",
    value: function _shouldBindKeyListeners(props) {
      var keyMap = this._getKeyMap(props);

      return !(0, _isEmpty["default"])(keyMap) || props.root;
    }
    /************************************************************************************
     * Registering key maps
     ************************************************************************************/

  }, {
    key: "addHotKeys",
    value: function addHotKeys(parentId) {
      var keyEventManager = _KeyEventManager["default"].getInstance();

      keyEventManager.registerComponentMount(this.id, parentId);
    }
    /**
     * Handles when the component gains focus by calling onFocus prop, if defined, and
     * registering itself with the KeyEventManager
     * @private
     */

  }, {
    key: "enableHotKeys",
    value: function enableHotKeys(props) {
      if (props.onFocus) {
        props.onFocus.apply(props, arguments);
      }

      var focusTreeId = _KeyEventManager["default"].getFocusOnlyEventStrategy().enableHotKeys(this.id, this._getKeyMap(props), this._getHandlers(props), getComponentOptions());

      if (!(0, _isUndefined["default"])(focusTreeId)) {
        /**
         * focusTreeId should never normally be undefined, but this return state is
         * used to indicate that a component with the same componentId has already
         * registered as focused/enabled (again, a condition that should not normally
         * occur, but apparently can for as-yet unknown reasons).
         *
         * @see https://github.com/greena13/react-hotkeys/issues/173
         */
        this._focusTreeIdsPush(focusTreeId);
      }

      this._setFocused(true);
    }
  }, {
    key: "updateHotKeys",
    value: function updateHotKeys(props) {
      var keyEventManager = _KeyEventManager["default"].getFocusOnlyEventStrategy();

      keyEventManager.reregisterKeyMap(this.id, props.keyMap);

      if (this._componentIsFocused() && (props.allowChanges || !_Configuration["default"].option('ignoreKeymapAndHandlerChangesByDefault'))) {
        var keyMap = props.keyMap,
            handlers = props.handlers;
        keyEventManager.updateEnabledHotKeys(this.focusTreeId, this.id, keyMap, handlers, getComponentOptions());
      }
    }
    /**
     * Handles when the component loses focus by calling the onBlur prop, if defined
     * and removing itself from the KeyEventManager
     * @private
     */

  }, {
    key: "disableHotKeys",
    value: function disableHotKeys(props) {
      if (props.onBlur) {
        props.onBlur.apply(props, arguments);
      }

      var retainCurrentFocusTreeId = _KeyEventManager["default"].getFocusOnlyEventStrategy().disableHotKeys(this.focusTreeId, this.id);

      if (!retainCurrentFocusTreeId) {
        this._focusTreeIdsShift();
      }

      this._setFocused(false);
    }
  }, {
    key: "removeKeyMap",
    value: function removeKeyMap(props) {
      var keyEventManager = _KeyEventManager["default"].getFocusOnlyEventStrategy();

      keyEventManager.deregisterKeyMap(this.id);

      _KeyEventManager["default"].getInstance().registerComponentUnmount();

      this.disableHotKeys(props);
    }
    /************************************************************************************
     * Focus and focus tree management
     ************************************************************************************/

  }, {
    key: "_componentIsFocused",
    value: function _componentIsFocused() {
      return this._focused === true;
    }
  }, {
    key: "_focusTreeIdsPush",
    value: function _focusTreeIdsPush(componentId) {
      this._focusTreeIds.push(componentId);
    }
  }, {
    key: "_focusTreeIdsShift",
    value: function _focusTreeIdsShift() {
      this._focusTreeIds.shift();
    }
  }, {
    key: "_setFocused",
    value: function _setFocused(focused) {
      this._focused = focused;
    }
  }, {
    key: "_delegateEventToManager",
    value: function _delegateEventToManager(event, methodName) {
      var discardFocusTreeId = _KeyEventManager["default"].getFocusOnlyEventStrategy()[methodName](event, this.focusTreeId, this.id, getEventOptions());

      if (discardFocusTreeId) {
        this._focusTreeIdsShift();
      }
    }
  }, {
    key: "_mergeWithOptions",
    value: function _mergeWithOptions(key, props) {
      return _objectSpread(_objectSpread({}, this._hotKeysOptions[key] || {}), props[key] || {});
    }
  }, {
    key: "_getHandlers",
    value: function _getHandlers(props) {
      return this._mergeWithOptions('handlers', props);
    }
  }, {
    key: "_getKeyMap",
    value: function _getKeyMap(props) {
      return this._mergeWithOptions('keyMap', props);
    }
  }]);

  return FocusOnlyComponentManager;
}();

var _default = FocusOnlyComponentManager;
exports["default"] = _default;