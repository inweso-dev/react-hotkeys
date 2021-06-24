"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _KeyEventType = _interopRequireDefault(require("../../const/KeyEventType"));

var _Configuration = _interopRequireDefault(require("../config/Configuration"));

var _KeyHistory = _interopRequireDefault(require("../listening/KeyHistory"));

var _KeyCombination = _interopRequireDefault(require("../listening/KeyCombination"));

var _ComponentTree = _interopRequireDefault(require("../definitions/ComponentTree"));

var _ComponentOptionsList = _interopRequireDefault(require("../definitions/ComponentOptionsList"));

var _ActionResolver = _interopRequireDefault(require("../matching/ActionResolver"));

var _printComponent = _interopRequireDefault(require("../../helpers/logging/printComponent"));

var _stateFromEvent = _interopRequireDefault(require("../../helpers/parsing-key-maps/stateFromEvent"));

var _KeyCombinationDecorator = _interopRequireDefault(require("../listening/KeyCombinationDecorator"));

var _lazyLoadAttribute = _interopRequireDefault(require("../../utils/object/lazyLoadAttribute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Defines common behaviour for key event strategies
 * @abstract
 * @class
 */
var AbstractKeyEventStrategy = /*#__PURE__*/function () {
  /********************************************************************************
   * Init & Reset
   ********************************************************************************/

  /**
   * Creates a new instance of an event strategy (this class is an abstract one and
   * not intended to be instantiated directly).
   * @param {Object} options Options for how event strategy should behave
   * @param {string} options.logLevel The level of severity to log at
   * @param {KeyEventManager} keyEventManager KeyEventManager used for passing
   *        messages between key event strategies
   */
  function AbstractKeyEventStrategy() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keyEventManager = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, AbstractKeyEventStrategy);

    /**
     * @typedef {number} ComponentId Unique index associated with every HotKeys component
     * as it becomes active.
     *
     * For focus-only components, this happens when the component is focused. The HotKeys
     * component closest to the DOM element in focus gets the smallest number (0) and
     * those further up the render tree get larger (incrementing) numbers. When a different
     * element is focused (triggering the creation of a new focus tree) all component indexes
     * are reset (de-allocated) and re-assigned to the new tree of HotKeys components that
     * are now in focus.
     *
     * For global components, component indexes are assigned when a HotKeys component is
     * mounted, and de-allocated when it unmounts. The component index counter is never reset
     * back to 0 and just keeps incrementing as new components are mounted.
     */

    /**
     * Should be overridden by children to set a Logger instance
     */
    this.logger = null;
    /**
     * Counter to maintain what the next component index should be
     * @type {ComponentId}
     */

    this.componentId = -1;
    /**
     * Reference to key event manager, so that information may pass between the
     * global strategy and the focus-only strategy
     * @type {KeyEventManager}
     */

    this.keyEventManager = keyEventManager;
    this.componentTree = new _ComponentTree["default"]();
    /**
     * Expected to be overridden by child class
     * @type {AbstractKeyEventSimulator}
     * @abstract
     */

    this._simulator = null;

    this._reset();

    this.resetKeyHistory();
  }
  /**
   * Resets all strategy state to the values it had when it was first created
   * @protected
   */


  _createClass(AbstractKeyEventStrategy, [{
    key: "_reset",
    value: function _reset() {
      this.componentList = new _ComponentOptionsList["default"]();
      this._actionResolver = null;
    }
  }, {
    key: "_recalculate",
    value: function _recalculate() {
      this._actionResolver = null;
      this.keyHistory.maxLength = this.componentList.longestSequence;
    }
  }, {
    key: "keyHistory",
    get: function get() {
      var _this = this;

      return (0, _lazyLoadAttribute["default"])(this, '_keyHistory', function () {
        return _this._newKeyHistory();
      });
    }
  }, {
    key: "actionResolver",
    get: function get() {
      var _this2 = this;

      return (0, _lazyLoadAttribute["default"])(this, '_actionResolver', function () {
        return new _ActionResolver["default"](_this2.componentList, _this2, _this2.logger);
      });
    }
    /**
     * Reset the state values that record the current and recent state of key events
     * @param {Object} options An options hash
     * @param {boolean} options.force Whether to force a hard reset of the key
     *        combination history.
     */

  }, {
    key: "resetKeyHistory",
    value: function resetKeyHistory() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._simulator) {
        this._simulator.clear();
      }

      if (this.keyHistory.any() && !options.force) {
        this._keyHistory = new _KeyHistory["default"]({
          maxLength: this.componentList.longestSequence
        }, new _KeyCombination["default"](this));
      } else {
        this._keyHistory = this._newKeyHistory();
      }
    }
  }, {
    key: "_newKeyHistory",
    value: function _newKeyHistory() {
      return new _KeyHistory["default"]({
        maxLength: this.componentList.longestSequence
      });
    }
    /********************************************************************************
     * Registering key maps
     ********************************************************************************/

    /**
     * Registers a new mounted component's key map so that it can be included in the
     * application's key map
     * @param {KeyMap} keyMap - Map of actions to key expressions
     * @returns {ComponentId} Unique component ID to assign to the focused HotKeys
     *          component and passed back when handling a key event
     */

  }, {
    key: "registerKeyMap",
    value: function registerKeyMap(keyMap) {
      this.componentId += 1;
      this.componentTree.add(this.componentId, keyMap);
      this.logger.verbose(this.logger.nonKeyEventPrefix(this.componentId, {
        focusTreeId: false
      }), 'Registered component in application key map:\n', "".concat((0, _printComponent["default"])(this.componentTree.get(this.componentId))));
      return this.componentId;
    }
    /**
     * Re-registers (updates) a mounted component's key map
     * @param {ComponentId} componentId - Id of the component that the keyMap belongs to
     * @param {KeyMap} keyMap - Map of actions to key expressions
     */

  }, {
    key: "reregisterKeyMap",
    value: function reregisterKeyMap(componentId, keyMap) {
      this.componentTree.update(componentId, keyMap);
    }
    /**
     * Registers that a component has now mounted, and declares its parent hot keys
     * component id so that actions may be properly resolved
     * @param {ComponentId} componentId - Id of the component that has mounted
     * @param {ComponentId} parentId - Id of the parent hot keys component
     */

  }, {
    key: "registerComponentMount",
    value: function registerComponentMount(componentId, parentId) {
      this.componentTree.setParent(componentId, parentId);
      this.logger.verbose(this.logger.nonKeyEventPrefix(componentId), 'Registered component mount:\n', "".concat((0, _printComponent["default"])(this.componentTree.get(componentId))));
    }
    /**
     * De-registers (removes) a mounted component's key map from the registry
     * @param {ComponentId} componentId - Id of the component that the keyMap
     *        belongs to
     */

  }, {
    key: "deregisterKeyMap",
    value: function deregisterKeyMap(componentId) {
      this.componentTree.remove(componentId);
      this.logger.verbose(this.logger.nonKeyEventPrefix(componentId), 'De-registered component. Remaining component Registry:\n', "".concat((0, _printComponent["default"])(this.componentTree.toJSON())));

      if (this.componentTree.isRootId(componentId)) {
        this.componentTree.clearRootId();
      }
    }
    /**
     * Registers the hotkeys defined by a HotKeys component
     * @param {ComponentId} componentId - Index of the component
     * @param {KeyMap} actionNameToKeyMap - Definition of actions and key maps defined
     *        in the HotKeys component
     * @param {HandlersMap} actionNameToHandlersMap - Map of ActionNames to handlers
     *        defined in the HotKeys component
     * @param {string} action - Description of the action that triggers the new component
     *        registering a new key map.
     * @param {Object} options - Hash of options that configure how the key map is built.
     * @protected
     */

  }, {
    key: "_addComponent",
    value: function _addComponent(componentId) {
      var actionNameToKeyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var actionNameToHandlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var action = arguments.length > 3 ? arguments[3] : undefined;
      var options = arguments.length > 4 ? arguments[4] : undefined;
      this.componentList.add(componentId, actionNameToKeyMap, actionNameToHandlersMap, options);

      this._recalculate();

      this.logger.debug(this.logger.nonKeyEventPrefix(componentId), action);
      this.logger.logComponentOptions(componentId, this.componentList.getById(componentId));
    }
  }, {
    key: "_updateComponent",
    value: function _updateComponent(componentId, actionNameToKeyMap, actionNameToHandlersMap, options) {
      this.componentList.update(componentId, actionNameToKeyMap, actionNameToHandlersMap, options);

      this._recalculate();

      this.logger.logComponentOptions(componentId, this.componentList.getById(componentId));
    }
    /********************************************************************************
     * Recording key events
     ********************************************************************************/

  }, {
    key: "currentCombination",
    get: function get() {
      return this.keyHistory.currentCombination;
    }
  }, {
    key: "_describeCurrentCombination",
    value: function _describeCurrentCombination() {
      var keyCombinationDecorator = new _KeyCombinationDecorator["default"](this.currentCombination);
      return keyCombinationDecorator.describe();
    }
  }, {
    key: "_recordKeyDown",
    value: function _recordKeyDown(event, key, componentId) {
      var keyEventState = (0, _stateFromEvent["default"])(event);
      var currentCombination = this.currentCombination;

      if (currentCombination.isKeyIncluded(key) || currentCombination.isEnding) {
        this._startAndLogNewKeyCombination(componentId, key, keyEventState);
      } else {
        this._recordNewKeyInCombination(key, _KeyEventType["default"].keydown, keyEventState, componentId);
      }
    }
  }, {
    key: "_startAndLogNewKeyCombination",
    value: function _startAndLogNewKeyCombination(componentId, keyName, keyEventState) {
      this.keyHistory.startNewKeyCombination(keyName, keyEventState);
      this.logger.verbose(this.logger.keyEventPrefix(componentId), "Started a new combination with '".concat(keyName, "'."));
      this.logger.logKeyHistory(this.keyHistory, componentId);
    }
  }, {
    key: "_recordNewKeyInCombination",
    value: function _recordNewKeyInCombination(keyName, keyEventType, keyEventState, componentId) {
      this.keyHistory.addKeyToCurrentCombination(keyName, keyEventType, keyEventState);

      if (keyEventType === _KeyEventType["default"].keydown) {
        this.logger.verbose(this.logger.keyEventPrefix(componentId), "Added '".concat(keyName, "' to current combination: '").concat(this._describeCurrentCombination(), "'."));
      }

      this.logger.logKeyHistory(this.keyHistory, componentId);
    }
    /********************************************************************************
     * Matching and calling handlers
     ********************************************************************************/

  }, {
    key: "_isIgnoringRepeatedEvent",
    value: function _isIgnoringRepeatedEvent(event, key, eventType, componentId) {
      if (event.repeat && _Configuration["default"].option('ignoreRepeatedEventsWhenKeyHeldDown')) {
        this.logger.logIgnoredKeyEvent(event, key, eventType, 'it was a repeated event', componentId);
        return true;
      }

      return false;
    }
  }]);

  return AbstractKeyEventStrategy;
}();

var _default = AbstractKeyEventStrategy;
exports["default"] = _default;