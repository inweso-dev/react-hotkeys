function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import Logger from './logging/Logger';
import FocusOnlyKeyEventStrategy from './strategies/FocusOnlyKeyEventStrategy';
import GlobalKeyEventStrategy from './strategies/GlobalKeyEventStrategy';
import Configuration from './config/Configuration';
import EventResponse from '../const/EventResponse';
import ApplicationKeyMapBuilder from './definitions/ApplicationKeyMapBuilder';
import lazyLoadAttribute from '../utils/object/lazyLoadAttribute';
/**
 * Provides a registry for keyboard sequences and events, and the handlers that should
 * be called when they are detected. Also contains the interface for processing and
 * matching keyboard events against its list of registered actions and handlers.
 * @class
 */

var KeyEventManager = /*#__PURE__*/function () {
  /**
   * Creates a new KeyEventManager instance. It is expected that only a single instance
   * will be used with a render tree.
   */
  function KeyEventManager() {
    var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, KeyEventManager);

    var logLevel = Configuration.option('logLevel');
    this.logger = configuration.logger || new Logger(logLevel);
    this.focusOnlyEventStrategy = new FocusOnlyKeyEventStrategy({
      configuration: configuration,
      logLevel: logLevel
    }, this);
    this.globalEventStrategy = new GlobalKeyEventStrategy({
      configuration: configuration,
      logLevel: logLevel
    }, this);
    this.mountedComponentsCount = 0;
    this._blurHandler = this._clearKeyHistory.bind(this);
  }
  /********************************************************************************
   * Generating key maps
   ********************************************************************************/

  /**
   * Returns a mapping of all of the application's actions and the key sequences
   * needed to trigger them.
   *
   * @type {ApplicationKeyMap} The application's key map
   */


  _createClass(KeyEventManager, [{
    key: "applicationKeyMap",
    get: function get() {
      return [this.globalEventStrategy, this.focusOnlyEventStrategy].reduce(function (memo, strategy) {
        var builder = new ApplicationKeyMapBuilder(strategy.componentTree);
        var keyMap = builder.build();
        return _objectSpread(_objectSpread({}, memo), keyMap);
      }, {});
    }
    /********************************************************************************
     * Registering key maps
     ********************************************************************************/

    /**
     * Registers that a component has now mounted, and declares its parent HotKeys
     * component id so that actions may be properly resolved
     * @param {ComponentId} componentId - Id of the component that has mounted
     * @param {ComponentId} parentId - Id of the parent HotKeys component
     */

  }, {
    key: "registerComponentMount",
    value: function registerComponentMount(componentId, parentId) {
      this._incrementComponentCount();

      return this.focusOnlyEventStrategy.registerComponentMount(componentId, parentId);
    }
  }, {
    key: "registerComponentUnmount",
    value: function registerComponentUnmount() {
      this._decrementComponentCount();
    }
  }, {
    key: "_incrementComponentCount",
    value: function _incrementComponentCount() {
      var preMountedComponentCount = this.mountedComponentsCount;
      this.mountedComponentsCount += 1;

      if (preMountedComponentCount === 0 && this.mountedComponentsCount === 1) {
        window.addEventListener('blur', this._blurHandler);
      }
    }
  }, {
    key: "_decrementComponentCount",
    value: function _decrementComponentCount() {
      var preMountedComponentCount = this.mountedComponentsCount;
      this.mountedComponentsCount -= 1;

      if (preMountedComponentCount === 1 && this.mountedComponentsCount === 0) {
        window.removeEventListener('blur', this._blurHandler);
      }
    }
  }, {
    key: "_clearKeyHistory",
    value: function _clearKeyHistory() {
      this.logger.info('HotKeys: Window focused - clearing key history');
      this.focusOnlyEventStrategy.resetKeyHistory({
        force: true
      });
      this.globalEventStrategy.resetKeyHistory({
        force: true
      });
    }
  }, {
    key: "registerGlobalComponentUnmount",
    value: function registerGlobalComponentUnmount() {
      this._decrementComponentCount();
    }
    /**
     * Registers that a component has now mounted, and declares its parent GlobalHotKeys
     * component id so that actions may be properly resolved
     * @param {ComponentId} componentId - Id of the component that has mounted
     * @param {ComponentId} parentId - Id of the parent GlobalHotKeys component
     */

  }, {
    key: "registerGlobalComponentMount",
    value: function registerGlobalComponentMount(componentId, parentId) {
      this._incrementComponentCount();

      return this.globalEventStrategy.registerComponentMount(componentId, parentId);
    }
    /********************************************************************************
     * Recording key combination
     ********************************************************************************/

    /**
     * Adds a listener function that will be called the next time a key combination completes
     * @param {keyCombinationListener} callbackFunction Listener function to be called
     * @returns {function} Function to call to cancel listening to the next key combination
     */

  }, {
    key: "addKeyCombinationListener",
    value: function addKeyCombinationListener(callbackFunction) {
      return this.globalEventStrategy.addKeyCombinationListener(callbackFunction);
    }
    /********************************************************************************
     * Global key events
     ********************************************************************************/

    /**
     * Ignores the next keyboard event immediately, rather than waiting for it to
     * match the ignoreEventsCondition
     * @param {SyntheticKeyboardEvent} event keyboard event to ignore
     * @see Configuration.ignoreEventsCondition
     */

  }, {
    key: "ignoreEvent",
    value: function ignoreEvent(event) {
      this.focusOnlyEventStrategy.eventPropagator.ignoreEvent(event);
    }
    /**
     * Forces the observation of the next keyboard event immediately, disregarding whether
     * the event matches the ignoreKeyEventsCondition
     * @param {SyntheticKeyboardEvent} event keyboard event to force the observation of
     * @see Configuration.ignoreEventsCondition
     */

  }, {
    key: "observeIgnoredEvents",
    value: function observeIgnoredEvents(event) {
      this.focusOnlyEventStrategy.eventPropagator.observeIgnoredEvents(event);
    }
    /**
     * Closes any hanging key combinations that have not received the key event indicated
     * by recordIndex.
     * @param {KeyName} keyName The name of the key whose state should be updated if it
     *        is currently set to keydown or keypress.
     * @param {KeyEventType} recordIndex Index of key event to move the key state
     *        up to.
     */

  }, {
    key: "closeHangingKeyCombination",
    value: function closeHangingKeyCombination(keyName, recordIndex) {
      this.focusOnlyEventStrategy.closeHangingKeyCombination(keyName, recordIndex);
    }
  }, {
    key: "reactAppHistoryWithEvent",
    value: function reactAppHistoryWithEvent(key, type) {
      var previousPropagation = this.focusOnlyEventStrategy.eventPropagator.previousPropagation;

      if (previousPropagation.isForKey(key) && previousPropagation.isForEventType(type)) {
        if (previousPropagation.isHandled()) {
          return EventResponse.handled;
        } else if (previousPropagation.isIgnoringEvent()) {
          return EventResponse.ignored;
        } else {
          return EventResponse.seen;
        }
      } else {
        return EventResponse.unseen;
      }
    }
  }, {
    key: "simulatePendingKeyPressEvents",
    value: function simulatePendingKeyPressEvents() {
      this.focusOnlyEventStrategy.simulatePendingKeyPressEvents();
    }
  }, {
    key: "simulatePendingKeyUpEvents",
    value: function simulatePendingKeyUpEvents() {
      this.focusOnlyEventStrategy.simulatePendingKeyUpEvents();
    }
  }, {
    key: "isGlobalListenersBound",
    value: function isGlobalListenersBound() {
      return this.globalEventStrategy.isListenersBound();
    }
  }], [{
    key: "getInstance",
    value:
    /**
     * Creates a new KeyEventManager instance if one does not already exist or returns the
     * instance that already exists.
     * @param {Object} configuration Configuration object
     * @param {Logger} configuration.logger Logger instance
     * @returns {KeyEventManager} The key event manager instance
     */
    function getInstance() {
      var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return lazyLoadAttribute(this, 'instance', function () {
        return new KeyEventManager(configuration);
      });
    }
  }, {
    key: "getFocusOnlyEventStrategy",
    value: function getFocusOnlyEventStrategy() {
      return this.getInstance().focusOnlyEventStrategy;
    }
  }, {
    key: "getGlobalEventStrategy",
    value: function getGlobalEventStrategy() {
      return this.getInstance().globalEventStrategy;
    }
  }]);

  return KeyEventManager;
}();

export default KeyEventManager;