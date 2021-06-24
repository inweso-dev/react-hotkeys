function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import KeyEventType from '../../const/KeyEventType';
import AbstractKeyEventStrategy from './AbstractKeyEventStrategy';
import describeKeyEventType from '../../helpers/logging/describeKeyEventType';
import KeyEventCounter from '../listening/KeyEventCounter';
import getKeyName from '../../helpers/resolving-handlers/getKeyName';
import Configuration from '../config/Configuration';
import describeKeyEvent from '../../helpers/logging/describeKeyEvent';
import isCmdKey from '../../helpers/parsing-key-maps/isCmdKey';
import EventResponse from '../../const/EventResponse';
import contains from '../../utils/collection/contains';
import stateFromEvent from '../../helpers/parsing-key-maps/stateFromEvent';
import GlobalKeyEventSimulator from '../simulation/GlobalKeyEventSimulator';
import GlobalEventListenerAdaptor from '../listening/GlobalEventListenerAdaptor';
import Registry from '../shared/Registry';
import GlobalLogger from '../logging/GlobalLogger';
import KeyCombinationDecorator from '../listening/KeyCombinationDecorator';
import KeyCombinationIterator from '../listening/KeyCombinationIterator';
/**
 * Defines behaviour for dealing with key maps defined in global HotKey components
 * @class
 */

var GlobalKeyEventStrategy = /*#__PURE__*/function (_AbstractKeyEventStra) {
  _inherits(GlobalKeyEventStrategy, _AbstractKeyEventStra);

  var _super = _createSuper(GlobalKeyEventStrategy);

  /********************************************************************************
   * Init & Reset
   ********************************************************************************/
  function GlobalKeyEventStrategy() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keyEventManager = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, GlobalKeyEventStrategy);

    /**
     * Set state that gets cleared every time a component gets mounted or unmounted
     */
    _this = _super.call(this, options, keyEventManager);
    _this.logger = new GlobalLogger(options.logLevel || 'warn', _assertThisInitialized(_this));
    /**
     * Set state that doesn't get cleared each time a new new component is mounted
     * or unmounted
     * @type {number}
     */

    _this.eventOptions = {
      ignoreEventsCondition: Configuration.option('ignoreEventsCondition')
    };
    /**
     * Dictionary of listener functions - currently only intended to house
     * keyCombinationListener
     */

    _this.listeners = new Registry();
    _this._simulator = new GlobalKeyEventSimulator(_assertThisInitialized(_this));
    _this._listenerAdaptor = new GlobalEventListenerAdaptor(_assertThisInitialized(_this), {
      logger: _this.logger
    });
    return _this;
  }
  /********************************************************************************
   * Enabling key maps and handlers
   ********************************************************************************/

  /**
   * Registers the actions and handlers of a HotKeys component that has mounted
   * @param {ComponentId} componentId - Id of the component that the keyMap belongs to
   * @param {KeyMap} actionNameToKeyMap - Map of actions to key expressions
   * @param {HandlersMap} actionNameToHandlersMap - Map of actions to handler functions
   * @param {Object} options Hash of options that configure how the actions
   *        and handlers are associated and called.
   * @param {Object} eventOptions - Options for how the event should be handled
   */


  _createClass(GlobalKeyEventStrategy, [{
    key: "enableHotKeys",
    value: function enableHotKeys(componentId) {
      var actionNameToKeyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var actionNameToHandlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 ? arguments[3] : undefined;
      var eventOptions = arguments.length > 4 ? arguments[4] : undefined;
      this.eventOptions = eventOptions;

      this._addComponent(componentId, actionNameToKeyMap, actionNameToHandlersMap, 'Mounted', options);
    }
    /**
     * Handles when a mounted global HotKeys component updates its props and changes
     * either the keyMap or handlers prop value
     * @param {ComponentId} componentId - The component index of the component to
     *        update
     * @param {KeyMap} keyMap - Map of actions to key expressions
     * @param {HandlersMap} handlersMap - Map of actions to handler functions
     * @param {Object} options Hash of options that configure how the actions
     *        and handlers are associated and called.
     * @param {Object} eventOptions - Options for how the event should be handled
     */

  }, {
    key: "updateEnabledHotKeys",
    value: function updateEnabledHotKeys(componentId) {
      var keyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var handlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 ? arguments[3] : undefined;
      var eventOptions = arguments.length > 4 ? arguments[4] : undefined;
      this.eventOptions = eventOptions;

      this._updateComponent(componentId, keyMap, handlersMap, options);
    }
    /**
     * Handles when a component is unmounted
     * @param {ComponentId} componentId - Index of component that is being unmounted
     */

  }, {
    key: "disableHotKeys",
    value: function disableHotKeys(componentId) {
      /**
       * Manually update the registered key map state, usually reset using
       * _resetRegisteredKeyMapsState() method
       */
      this.componentList.remove(componentId);
      this.logger.debug(this.logger.nonKeyEventPrefix(componentId), "Unmounted global component ".concat(componentId));

      this._recalculate();
    }
  }, {
    key: "_recalculate",
    value: function _recalculate() {
      _get(_getPrototypeOf(GlobalKeyEventStrategy.prototype), "_recalculate", this).call(this);

      this._updateDocumentHandlers();
    }
  }, {
    key: "_updateDocumentHandlers",
    value: function _updateDocumentHandlers() {
      var listenersShouldBeBound = this._shouldListenersBeBound();

      var listenersAreBound = this.isListenersBound();

      if (!listenersAreBound && listenersShouldBeBound) {
        this._listenerAdaptor.bindListeners();
      } else if (listenersAreBound && !listenersShouldBeBound) {
        this._listenerAdaptor.unbindListeners();
      }
    }
  }, {
    key: "isListenersBound",
    value: function isListenersBound() {
      return this._listenerAdaptor.isListenersBound();
    }
    /**
     * Whether the document listeners should be bound, to record key events. Basically a check
     * to see if there are any global key maps, or whether the user is currently rebinding to
     * a new key combination.
     * @returns {boolean} True if the document listeners should be bound
     * @private
     */

  }, {
    key: "_shouldListenersBeBound",
    value: function _shouldListenersBeBound() {
      return this.componentList.length !== 0 || this.listeners.get('keyCombination');
    }
    /********************************************************************************
     * Recording key events
     ********************************************************************************/

    /**
     * Records a keydown keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called once when a keyboard event bubbles up to document, and checks
     * the keymaps for all of the mounted global HotKey components.
     * @param {SyntheticKeyboardEvent} event - Event containing the key name and state
     */

  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      var key = getKeyName(event);

      if (this._isIgnoringRepeatedEvent(event, key, KeyEventType.keydown)) {
        return;
      }

      this.currentCombination.resolveModifierFlagDiscrepancies(event, key, KeyEventType.keydown);

      var reactAppResponse = this._howReactAppRespondedTo(event, key, KeyEventType.keydown);

      if (reactAppResponse === EventResponse.unseen && this.eventOptions.ignoreEventsCondition(event)) {
        this.logger.logEventRejectedByFilter(event, key, KeyEventType.keydown);
        return;
      }

      if (reactAppResponse !== EventResponse.ignored) {
        this._recordKeyDown(event, key);
      }

      this._callHandlerIfNeeded(reactAppResponse, event, key, KeyEventType.keydown);

      this.keyEventManager.simulatePendingKeyPressEvents();

      this._simulator.handleKeyPressSimulation({
        event: event,
        key: key
      });
    }
  }, {
    key: "_howReactAppRespondedTo",
    value: function _howReactAppRespondedTo(event, key, keyEventType) {
      var reactAppHistoryWithEvent = this.keyEventManager.reactAppHistoryWithEvent(key, keyEventType);

      switch (reactAppHistoryWithEvent) {
        case EventResponse.handled:
          this.logger.logIgnoredKeyEvent(event, key, keyEventType, 'React app has already handled it');
          break;

        case EventResponse.ignored:
          this.logger.logIgnoredKeyEvent(event, key, keyEventType, 'React app has declared it should be ignored');
          break;

        case EventResponse.seen:
          this.logger.debug(this.logger.keyEventPrefix(), "Received ".concat(describeKeyEvent(event, key, keyEventType), " event (that has already passed through React app)."));
          break;

        default:
          KeyEventCounter.incrementId();
          this.logger.debug(this.logger.keyEventPrefix(), "New ".concat(describeKeyEvent(event, key, keyEventType), " event (that has NOT passed through React app)."));
      }

      return reactAppHistoryWithEvent;
    }
    /**
     * Records a keypress keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called once when a keyboard event bubbles up to document, and checks
     * the keymaps for all of the mounted global HotKey components.
     * @param {SyntheticKeyboardEvent} event - Event containing the key name and state
     */

  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(event) {
      var key = getKeyName(event);

      if (this._isIgnoringRepeatedEvent(event, key, KeyEventType.keypress)) {
        return;
      } else if (this.currentCombination.isKeyPressSimulated(key)) {
        this.logger.logEventAlreadySimulated(event, key, KeyEventType.keypress);
        return;
      }
      /**
       * We first decide if the keypress event should be handled (to ensure the correct
       * order of logging statements)
       */


      var reactAppResponse = this._howReactAppRespondedTo(event, key, KeyEventType.keypress);
      /**
       * Add new key event to key combination history
       */


      if (this.currentCombination.isKeyIncluded(key)) {
        this._recordNewKeyInCombination(key, KeyEventType.keypress, stateFromEvent(event));
      }

      if (reactAppResponse === EventResponse.unseen) {
        /**
         * If the key event has not been seen by the React application, we ensure that
         * it's not still waiting for it. This occurs when action handlers bound to keydown
         * move the focus outside of the react app before it can record the keypress or
         * keyup
         */
        this.keyEventManager.closeHangingKeyCombination(key, KeyEventType.keypress);

        if (this.eventOptions.ignoreEventsCondition(event)) {
          this.logger.logEventRejectedByFilter(event, key, KeyEventType.keypress);
          return;
        }
      }

      this._callHandlerIfNeeded(reactAppResponse, event, key, KeyEventType.keypress);
    }
  }, {
    key: "_callHandlerIfNeeded",
    value: function _callHandlerIfNeeded(reactAppResponse, event, key, eventType) {
      if (!contains([EventResponse.ignored, EventResponse.handled], reactAppResponse)) {
        this._callHandlerIfExists(event, key, eventType);
      }
    }
    /**
     * Records a keyup keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called once when a keyboard event bubbles up to document, and checks
     * the keymaps for all of the mounted global HotKey components.
     * @param {SyntheticKeyboardEvent} event - Event containing the key name and state
     */

  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event) {
      var key = getKeyName(event);

      if (this.currentCombination.isKeyUpSimulated(key)) {
        this.logger.logEventAlreadySimulated(event, key, KeyEventType.keyup);
        return;
      }
      /**
       * We first decide if the keyup event should be handled (to ensure the correct
       * order of logging statements)
       */


      var reactAppResponse = this._howReactAppRespondedTo(event, key, KeyEventType.keyup);
      /**
       * We then add the keyup to our current combination - regardless of whether
       * it's to be handled or not. We need to do this to ensure that if a handler
       * function changes focus to a context that ignored events, the keyup event
       * is not lost (leaving react hotkeys thinking the key is still pressed).
       */


      if (this.currentCombination.isKeyIncluded(key)) {
        this._recordNewKeyInCombination(key, KeyEventType.keyup, stateFromEvent(event));
      }

      if (reactAppResponse === EventResponse.unseen) {
        /**
         * If the key event has not been seen by the React application, we ensure that
         * it's not still waiting for it. This occurs when action handlers bound to keydown
         * or keypress move the focus outside of the react app before it can record the keyup
         */
        this.keyEventManager.closeHangingKeyCombination(key, KeyEventType.keyup);

        if (this.eventOptions.ignoreEventsCondition(event)) {
          this.logger.logIgnoredKeyEvent(event, key, KeyEventType.keyup, 'ignoreEventsFilter rejected it');
        } else {
          this._callHandlerIfNeeded(reactAppResponse, event, key, KeyEventType.keyup);
        }
      } else {
        this._callHandlerIfNeeded(reactAppResponse, event, key, KeyEventType.keyup);
      }
      /**
       * We simulate any hidden keyup events hidden by the command key, regardless
       * of whether the event should be ignored or not
       */


      this._simulateKeyUpEventsHiddenByCmd(event, key);

      this._callKeyCombinationCallbackIfDefined();
    }
  }, {
    key: "_simulateKeyUpEventsHiddenByCmd",
    value: function _simulateKeyUpEventsHiddenByCmd(event, key) {
      var _this2 = this;

      if (isCmdKey(key)) {
        /**
         * We simulate pending key events in the React app before we do it globally
         */
        this.keyEventManager.simulatePendingKeyUpEvents();
        var iterator = new KeyCombinationIterator(this.currentCombination);
        iterator.forEachKey(function (keyName) {
          if (isCmdKey(keyName)) {
            return;
          }

          _this2._simulator.handleKeyUpSimulation({
            event: event,
            key: keyName
          });
        });
      }
    }
  }, {
    key: "_callKeyCombinationCallbackIfDefined",
    value: function _callKeyCombinationCallbackIfDefined() {
      if (this.listeners.get('keyCombination') && this.currentCombination.hasEnded()) {
        var keyCombinationDecorator = new KeyCombinationDecorator(this.currentCombination);
        this.listeners.get('keyCombination')({
          keys: keyCombinationDecorator.asKeyDictionary(),
          id: keyCombinationDecorator.describe()
        });
      }
    }
    /********************************************************************************
     * Matching and calling handlers
     ********************************************************************************/

  }, {
    key: "_callHandlerIfExists",
    value: function _callHandlerIfExists(event, keyName, keyEventType) {
      var eventName = describeKeyEventType(keyEventType);

      var combinationName = this._describeCurrentCombination();

      if (!this.componentList.anyActionsForEventType(keyEventType)) {
        /**
         * If there are no handlers registered for the particular key event type
         * (keydown, keypress, keyup) then skip trying to find a matching handler
         * for the current key combination
         */
        this.logger.logIgnoredEvent("'".concat(combinationName, "' ").concat(eventName), "it doesn't have any ".concat(eventName, " handlers"));
        return;
      }
      /**
       * If there is at least one handler for the specified key event type (keydown,
       * keypress, keyup), then attempt to find a handler that matches the current
       * key combination
       */


      this.logger.verbose(this.logger.keyEventPrefix(), "Attempting to find action matching '".concat(combinationName, "' ").concat(eventName, " . . ."));

      this._callClosestMatchingHandler(event, keyName, keyEventType);
    }
  }, {
    key: "_callClosestMatchingHandler",
    value: function _callClosestMatchingHandler(event, keyName, keyEventType) {
      var componentListIterator = this.componentList.iterator;

      while (componentListIterator.next()) {
        var matchFound = this.actionResolver.callClosestMatchingHandler(event, keyName, keyEventType, componentListIterator.position, 0);

        if (matchFound) {
          this.logger.debug(this.logger.keyEventPrefix(), "Searching no further, as handler has been found (and called).");
          return;
        }
      }
    }
  }, {
    key: "stopEventPropagation",
    value: function stopEventPropagation(event, componentId) {
      this.logger.debug(this.logger.keyEventPrefix(componentId), 'Stopping further event propagation.');

      if (!event.simulated) {
        event.stopPropagation();
      }
    }
    /********************************************************************************
     * Recording key combination
     ********************************************************************************/

    /**
     * Add a new key combination listener function to be called the next time a key
     * combination completes (assuming the cancel function is not called).
     * @param {keyCombinationListener} callbackFunction Function to call with the next
     *        completed key combination
     * @returns {function} Function to call to cancel listening for the next key
     *        combination
     */

  }, {
    key: "addKeyCombinationListener",
    value: function addKeyCombinationListener(callbackFunction) {
      var _this3 = this;

      var cancel = function cancel() {
        _this3.listeners.remove('keyCombination');
      };

      this.listeners.set('keyCombination', function (keyCombination) {
        callbackFunction(keyCombination);
        cancel();
      });

      this._updateDocumentHandlers();

      return cancel;
    }
  }]);

  return GlobalKeyEventStrategy;
}(AbstractKeyEventStrategy);

export default GlobalKeyEventStrategy;