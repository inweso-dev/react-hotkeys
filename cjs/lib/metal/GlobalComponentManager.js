"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _KeyEventManager = _interopRequireDefault(require("../KeyEventManager"));

var _Configuration = _interopRequireDefault(require("../config/Configuration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GlobalComponentManager = /*#__PURE__*/function () {
  function GlobalComponentManager(keyMap) {
    _classCallCheck(this, GlobalComponentManager);

    this.id = _KeyEventManager["default"].getGlobalEventStrategy().registerKeyMap(keyMap);
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
      globalHotKeysParentId: this.id
    };
  }

  _createClass(GlobalComponentManager, [{
    key: "addHotKeys",
    value: function addHotKeys(props, context) {
      var keyMap = props.keyMap,
          handlers = props.handlers;
      var globalHotKeysParentId = context.globalHotKeysParentId;

      _KeyEventManager["default"].getInstance().registerGlobalComponentMount(this.id, globalHotKeysParentId);

      _KeyEventManager["default"].getGlobalEventStrategy().enableHotKeys(this.id, keyMap, handlers, GlobalComponentManager._getComponentOptions(), GlobalComponentManager._getEventOptions());
    }
  }, {
    key: "updateHotKeys",
    value: function updateHotKeys(props) {
      var keyEventManager = _KeyEventManager["default"].getGlobalEventStrategy();

      keyEventManager.reregisterKeyMap(this.id, props.keyMap);

      if (props.allowChanges || !_Configuration["default"].option('ignoreKeymapAndHandlerChangesByDefault')) {
        var keyMap = props.keyMap,
            handlers = props.handlers;
        /**
         * Component defines global hotkeys, so any changes to props may have changes
         * that should have immediate effect
         */

        keyEventManager.updateEnabledHotKeys(this.id, keyMap, handlers, GlobalComponentManager._getComponentOptions(), GlobalComponentManager._getEventOptions());
      }
    }
  }, {
    key: "removeKeyMap",
    value: function removeKeyMap() {
      var keyEventManager = _KeyEventManager["default"].getGlobalEventStrategy();

      keyEventManager.deregisterKeyMap(this.id);
      keyEventManager.disableHotKeys(this.id);

      _KeyEventManager["default"].getInstance().registerGlobalComponentUnmount();
    }
  }], [{
    key: "_getComponentOptions",
    value: function _getComponentOptions() {
      return {
        defaultKeyEvent: _Configuration["default"].option('defaultKeyEvent')
      };
    }
  }, {
    key: "_getEventOptions",
    value: function _getEventOptions() {
      return {
        ignoreEventsCondition: _Configuration["default"].option('ignoreEventsCondition')
      };
    }
  }]);

  return GlobalComponentManager;
}();

var _default = GlobalComponentManager;
exports["default"] = _default;