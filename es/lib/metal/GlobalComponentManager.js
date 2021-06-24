function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import KeyEventManager from '../KeyEventManager';
import Configuration from '../config/Configuration';

var GlobalComponentManager = /*#__PURE__*/function () {
  function GlobalComponentManager(keyMap) {
    _classCallCheck(this, GlobalComponentManager);

    this.id = KeyEventManager.getGlobalEventStrategy().registerKeyMap(keyMap);
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
      KeyEventManager.getInstance().registerGlobalComponentMount(this.id, globalHotKeysParentId);
      KeyEventManager.getGlobalEventStrategy().enableHotKeys(this.id, keyMap, handlers, GlobalComponentManager._getComponentOptions(), GlobalComponentManager._getEventOptions());
    }
  }, {
    key: "updateHotKeys",
    value: function updateHotKeys(props) {
      var keyEventManager = KeyEventManager.getGlobalEventStrategy();
      keyEventManager.reregisterKeyMap(this.id, props.keyMap);

      if (props.allowChanges || !Configuration.option('ignoreKeymapAndHandlerChangesByDefault')) {
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
      var keyEventManager = KeyEventManager.getGlobalEventStrategy();
      keyEventManager.deregisterKeyMap(this.id);
      keyEventManager.disableHotKeys(this.id);
      KeyEventManager.getInstance().registerGlobalComponentUnmount();
    }
  }], [{
    key: "_getComponentOptions",
    value: function _getComponentOptions() {
      return {
        defaultKeyEvent: Configuration.option('defaultKeyEvent')
      };
    }
  }, {
    key: "_getEventOptions",
    value: function _getEventOptions() {
      return {
        ignoreEventsCondition: Configuration.option('ignoreEventsCondition')
      };
    }
  }]);

  return GlobalComponentManager;
}();

export default GlobalComponentManager;