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

import AbstractKeyEventStrategy from './AbstractKeyEventStrategy';
import KeyEventType from '../../const/KeyEventType';
import describeKeyEventType from '../../helpers/logging/describeKeyEventType';
import getKeyName from '../../helpers/resolving-handlers/getKeyName';
import isCmdKey from '../../helpers/parsing-key-maps/isCmdKey';
import describeKeyEvent from '../../helpers/logging/describeKeyEvent';
import EventResponse from '../../const/EventResponse';
import KeyEventState from '../../const/KeyEventState';
import stateFromEvent from '../../helpers/parsing-key-maps/stateFromEvent';
import EventPropagator from '../listening/EventPropagator';
import FocusOnlyKeyEventSimulator from '../simulation/FocusOnlyKeyEventSimulator';
import FocusTree from '../listening/FocusTree';
import FocusOnlyLogger from '../logging/FocusOnlyLogger';
import KeyCombinationIterator from '../listening/KeyCombinationIterator';
/**
 * Defines behaviour for dealing with key maps defined in focus-only HotKey components
 * @class
 */

var FocusOnlyKeyEventStrategy = /*#__PURE__*/function (_AbstractKeyEventStra) {
  _inherits(FocusOnlyKeyEventStrategy, _AbstractKeyEventStra);

  var _super = _createSuper(FocusOnlyKeyEventStrategy);

  /********************************************************************************
   * Init & Reset
   ********************************************************************************/
  function FocusOnlyKeyEventStrategy() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keyEventManager = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, FocusOnlyKeyEventStrategy);

    /******************************************************************************
     * Set state that DOES get cleared on each new focus tree
     ******************************************************************************/
    _this = _super.call(this, options, keyEventManager);
    _this.logger = new FocusOnlyLogger(options.logLevel || 'warn', _assertThisInitialized(_this));
    _this.eventPropagator.logger = _this.logger;
    /*****************************************************************************
     * State that doesn't get cleared on each new focus tree
     *****************************************************************************/

    /**
     * Unique identifier given to each focus tree - when the focus in the browser
     * changes, and a different tree of elements are focused, a new id is allocated
     * @typedef {number} FocusTreeId
     */

    /**
     * Counter to keep track of what focus tree ID should be allocated next
     * @type {FocusTreeId}
     */

    _this.focusTree = new FocusTree();
    _this._simulator = new FocusOnlyKeyEventSimulator(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * Clears the internal state, wiping any history of key events and registered handlers
   * so they have no effect on the next tree of focused HotKeys components
   * @private
   */


  _createClass(FocusOnlyKeyEventStrategy, [{
    key: "_reset",
    value: function _reset() {
      _get(_getPrototypeOf(FocusOnlyKeyEventStrategy.prototype), "_reset", this).call(this);

      if (this._simulator) {
        this._simulator.clear();
      }
      /**
       * Increase the unique ID associated with each unique focus tree
       * @type {number}
       */


      if (this.focusTree) {
        this.focusTree["new"]();
      }

      this.eventPropagator = new EventPropagator(this.componentList);
      this.eventPropagator.logger = this.logger;
    }
    /********************************************************************************
     * Registering key maps and handlers
     ********************************************************************************/

    /**
     * Registers the actions and handlers of a HotKeys component that has gained focus
     * @param {ComponentId} componentId - Id of the component that the keyMap belongs to
     * @param {KeyMap} actionNameToKeyMap - Map of actions to key expressions
     * @param {HandlersMap} actionNameToHandlersMap - Map of actions to handler functions
     * @param {Object} options Hash of options that configure how the actions
     *        and handlers are associated and called.
     * @returns {FocusTreeId|undefined} The current focus tree's ID or undefined if the
     *        the <tt>componentId</tt> has already been registered (shouldn't normally
     *        occur).
     */

  }, {
    key: "enableHotKeys",
    value: function enableHotKeys(componentId) {
      var actionNameToKeyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var actionNameToHandlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 ? arguments[3] : undefined;

      if (this.resetOnNextFocus) {
        /**
         * We know components have just lost focus or keymaps have already been built,
         * meaning we are either anticipating a new set of components to be focused or
         * we are receiving notice of a component being focused when we aren't expecting it.
         * In either case, the internal state needs to be reset.
         */
        this._reset();

        this.resetOnNextFocus = false;
      }

      if (this.componentList.containsId(componentId)) {
        /**
         * The <tt>componentId</tt> has already been registered - this occurs when the
         * same component has somehow managed to be focused twice, without being blurred
         * in between.
         *
         * @see https://github.com/greena13/react-hotkeys/issues/173
         */
        return;
      }

      this._addComponent(componentId, actionNameToKeyMap, actionNameToHandlersMap, 'Focused', options);

      return this.focusTree.id;
    }
    /**
     * Handles when a HotKeys component that is in focus updates its props and changes
     * either the keyMap or handlers prop value
     * @param {FocusTreeId} focusTreeId - The ID of the focus tree the component is part of.
     *        Used to identify (and ignore) stale updates.
     * @param {ComponentId} componentId - The component index of the component to
     *        update
     * @param {KeyMap} keyMap - Map of key sequences to action names
     * @param {HandlersMap} handlersMap - Map of action names to handler
     *        functions
     * @param {Object} options Hash of options that configure how the actions
     *        and handlers are associated and called.
     */

  }, {
    key: "updateEnabledHotKeys",
    value: function updateEnabledHotKeys(focusTreeId, componentId) {
      var keyMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var handlersMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var options = arguments.length > 4 ? arguments[4] : undefined;

      if (this.focusTree.isNewerThan(focusTreeId) || !this.componentList.containsId(componentId)) {
        return;
      }

      this._updateComponent(componentId, keyMap, handlersMap, options);
    }
    /**
     * Handles when a component loses focus by resetting the internal state, ready to
     * receive the next tree of focused HotKeys components
     * @param {FocusTreeId} focusTreeId - Id of focus tree component thinks it's
     *        apart of
     * @param {ComponentId} componentId - Index of component that is blurring
     * @returns {boolean} Whether the component still has event propagation yet to handle
     */

  }, {
    key: "disableHotKeys",
    value: function disableHotKeys(focusTreeId, componentId) {
      this.resetOnNextFocus = true;
      var outstandingEventPropagation = this.eventPropagator.isPendingPropagation();
      this.logger.debug("".concat(this.logger.keyEventPrefix(componentId, {
        focusTreeId: focusTreeId
      })), "Lost focus".concat(outstandingEventPropagation ? ' (Key event has yet to propagate through it)' : '', "."));
      return outstandingEventPropagation;
    }
    /********************************************************************************
     * Recording key events
     ********************************************************************************/

    /**
     * @typedef {KeyboardEvent} SyntheticKeyboardEvent
     * @property {KeyboardEvent} nativeEvent The native event the SyntheticEvent is wrapping
     * @property {function} persist
     */

    /**
     * Records a keydown keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called many times as a keyboard event bubbles up through the React
     * render tree. The event is only registered the first time it is seen and results
     * of some calculations are cached. The event is matched against the handlers registered
     * at each component level, to ensure the proper handler declaration scoping.
     * @param {SyntheticKeyboardEvent} event - Event containing the key name and state
     * @param {FocusTreeId} focusTreeId - Id of focus tree component thinks it's apart of
     * @param {ComponentId} componentId - The id of the component that is currently handling
     *        the keyboard event as it bubbles towards the document root.
     * @param {Object} options - Hash of options that configure how the event is handled.
     * @returns {boolean} Whether the event was discarded because it was part of an old focus tree
     */

  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event, focusTreeId, componentId) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var key = getKeyName(event);

      if (this.focusTree.isNewerThan(focusTreeId)) {
        this.logger.logIgnoredKeyEvent(event, key, KeyEventType.keydown, "it had an old focus tree id: ".concat(focusTreeId), componentId);
        this.eventPropagator.ignoreEvent(event);
        return true;
      } else if (this._isIgnoringRepeatedEvent(event, key, KeyEventType.keydown, componentId)) {
        return false;
      }

      if (this.eventPropagator.startNewPropagationStep(componentId, event, key, KeyEventType.keydown)) {
        var responseAction = this._howToHandleKeyEvent(event, focusTreeId, componentId, key, options, KeyEventType.keydown);

        if (responseAction === EventResponse.handled) {
          this._recordKeyDown(event, key, componentId);

          this._callHandlerIfActionNotHandled(event, key, KeyEventType.keydown, componentId, focusTreeId);
        }

        this._simulator.handleKeyPressSimulation({
          event: event,
          key: key,
          focusTreeId: focusTreeId,
          componentId: componentId,
          options: options
        });

        this.eventPropagator.finishPropagationStep();
      }

      return false;
    }
  }, {
    key: "_howToHandleKeyEvent",
    value: function _howToHandleKeyEvent(event, focusTreeId, componentId, key, options, keyEventType) {
      if (this.eventPropagator.isFirstPropagationStep()) {
        if (options.ignoreEventsCondition(event) && this.eventPropagator.ignoreEvent(event)) {
          return this._eventIsToBeIgnored(event, componentId, key, keyEventType);
        }

        this.logger.debug(this.logger.keyEventPrefix(componentId), "New ".concat(describeKeyEvent(event, key, keyEventType), " event."));
        this.currentCombination.resolveModifierFlagDiscrepancies(event, key, keyEventType);
      } else if (this.eventPropagator.isIgnoringEvent()) {
        return this._eventIsToBeIgnored(event, componentId, key, keyEventType);
      }

      return EventResponse.handled;
    }
  }, {
    key: "_eventIsToBeIgnored",
    value: function _eventIsToBeIgnored(event, componentId, key, keyEventType) {
      this.logger.logIgnoredKeyEvent(event, key, keyEventType, "ignoreEventsFilter rejected it", componentId);
      return EventResponse.ignored;
    }
    /**
     * Records a keypress keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called many times as a keyboard event bubbles up through the React
     * render tree. The event is only registered the first time it is seen and results
     * of some calculations are cached. The event is matched against the handlers registered
     * at each component level, to ensure the proper handler declaration scoping.
     * @param {SyntheticKeyboardEvent} event - Event containing the key name and state
     * @param {FocusTreeId} focusTreeId Id - of focus tree component thinks it's apart of
     * @param {ComponentId} componentId - The index of the component that is currently handling
     *        the keyboard event as it bubbles towards the document root.
     * @param {Object} options - Hash of options that configure how the event
     *        is handled.
     * @returns {boolean} Whether the HotKeys component should discard its current focus
     *        tree Id, because it belongs to an old focus tree.
     */

  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(event, focusTreeId, componentId, options) {
      var key = getKeyName(event);

      if (this._isIgnoringRepeatedEvent(event, key, KeyEventType.keypress, componentId)) {
        return false;
      } else if (this.currentCombination.isKeyPressSimulated(key)) {
        this._ignoreAlreadySimulatedEvent(event, key, KeyEventType.keypress, componentId);

        return false;
      }

      var shouldDiscardFocusTreeId = this.focusTree.isNewerThan(focusTreeId);

      if (this.eventPropagator.startNewPropagationStep(componentId, event, key, KeyEventType.keypress)) {
        /**
         * We first decide if the keypress event should be handled (to ensure the correct
         * order of logging statements)
         */
        var responseAction = this._howToHandleKeyEvent(event, focusTreeId, componentId, key, options, KeyEventType.keypress);

        if (this.eventPropagator.isFirstPropagationStep(componentId) && this.currentCombination.isKeyIncluded(key)) {
          this._recordNewKeyInCombination(key, KeyEventType.keypress, stateFromEvent(event), componentId);
        }
        /**
         * We attempt to find a handler of the event, only if it has not already been
         * handled and should not be ignored
         */


        if (responseAction === EventResponse.handled) {
          this._callHandlerIfActionNotHandled(event, key, KeyEventType.keypress, componentId, focusTreeId);
        }

        this.eventPropagator.finishPropagationStep();
      }

      return shouldDiscardFocusTreeId;
    }
    /**
     * Records a keyup keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called many times as a keyboard event bubbles up through the React
     * render tree. The event is only registered the first time it is seen and results
     * of some calculations are cached. The event is matched against the handlers registered
     * at each component level, to ensure the proper handler declaration scoping.
     * @param {SyntheticKeyboardEvent} event Event containing the key name and state
     * @param {FocusTreeId} focusTreeId Id of focus tree component thinks it's apart of
     * @param {ComponentId} componentId The index of the component that is currently handling
     *        the keyboard event as it bubbles towards the document root.
     * @param {Object} options Hash of options that configure how the event
     *        is handled.
     * @returns {boolean} Whether HotKeys component should discard its current focusTreeId
     *        because it's stale (part of an old focus tree)
     */

  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event, focusTreeId, componentId, options) {
      var key = getKeyName(event);

      if (this.currentCombination.isKeyUpSimulated(key)) {
        this._ignoreAlreadySimulatedEvent(event, key, KeyEventType.keyup, componentId);

        return false;
      }

      var shouldDiscardFocusId = this.focusTree.isNewerThan(focusTreeId);
      var propagator = this.eventPropagator;

      if (propagator.startNewPropagationStep(componentId, event, key, KeyEventType.keyup)) {
        /**
         * We first decide if the keyup event should be handled (to ensure the correct
         * order of logging statements)
         */
        var responseAction = this._howToHandleKeyEvent(event, focusTreeId, componentId, key, options, KeyEventType.keyup);
        /**
         * We then add the keyup to our current combination - regardless of whether
         * it's to be handled or not. We need to do this to ensure that if a handler
         * function changes focus to a context that ignored events, the keyup event
         * is not lost (leaving react hotkeys thinking the key is still pressed).
         */


        if (propagator.isFirstPropagationStep(componentId) && this.currentCombination.isKeyIncluded(key)) {
          this._recordNewKeyInCombination(key, KeyEventType.keyup, stateFromEvent(event), componentId);
        }
        /**
         * We attempt to find a handler of the event, only if it has not already been
         * handled and should not be ignored
         */


        if (responseAction === EventResponse.handled) {
          this._callHandlerIfActionNotHandled(event, key, KeyEventType.keyup, componentId, focusTreeId);
        }
        /**
         * We simulate any hidden keyup events hidden by the command key, regardless
         * of whether the event should be ignored or not
         */


        this._simulateKeyUpEventsHiddenByCmd(event, key, focusTreeId, componentId, options);

        propagator.finishPropagationStep();
      }

      return shouldDiscardFocusId;
    }
  }, {
    key: "_ignoreAlreadySimulatedEvent",
    value: function _ignoreAlreadySimulatedEvent(event, key, eventType, componentId) {
      this.logger.logAlreadySimulatedEvent(event, key, eventType, componentId);
      this.eventPropagator.ignoreEvent(event);
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
      var currentCombination = this.currentCombination;

      if (currentCombination.isKeyIncluded(keyName) && !currentCombination.isEventTriggered(keyName, recordIndex)) {
        /**
         * If the key is in the current combination and recorded as still being pressed
         * down (as either keydown or keypress), then we update the state
         * to keypress or keyup (depending on the value of recordIndex).
         */
        currentCombination.setKeyState(keyName, recordIndex, KeyEventState.simulated);
      }
    }
  }, {
    key: "_simulateKeyUpEventsHiddenByCmd",
    value: function _simulateKeyUpEventsHiddenByCmd(event, key, focusTreeId, componentId, options) {
      var _this2 = this;

      if (isCmdKey(key)) {
        var iterator = new KeyCombinationIterator(this.currentCombination);
        iterator.forEachKey(function (keyName) {
          if (isCmdKey(keyName)) {
            return;
          }

          _this2._simulator.handleKeyUpSimulation({
            event: event,
            key: keyName,
            focusTreeId: focusTreeId,
            componentId: componentId,
            options: options
          });
        });
      }
    }
  }, {
    key: "stopEventPropagation",
    value: function stopEventPropagation(event, componentId) {
      if (this.eventPropagator.stop(event)) {
        this.logger.debug(this.logger.keyEventPrefix(componentId), 'Stopping further event propagation.');
      }
    }
    /********************************************************************************
     * Event simulation
     ********************************************************************************/

  }, {
    key: "simulatePendingKeyPressEvents",
    value: function simulatePendingKeyPressEvents() {
      this._simulator.simulatePendingKeyPressEvents();
    }
  }, {
    key: "simulatePendingKeyUpEvents",
    value: function simulatePendingKeyUpEvents() {
      this._simulator.simulatePendingKeyUpEvents();
    }
  }, {
    key: "shouldSimulateEventsImmediately",
    value: function shouldSimulateEventsImmediately() {
      return !this.keyEventManager.isGlobalListenersBound();
    }
    /********************************************************************************
     * Matching and calling handlers
     ********************************************************************************/

    /**
     * Calls the first handler that matches the current key event if the action has not
     * already been handled in a more deeply nested component
     * @param {SyntheticKeyboardEvent} event Keyboard event object to be passed to the handler
     * @param {NormalizedKeyName} keyName Normalized key name
     * @param {KeyEventType} keyEventType The record index of the current key event type
     * @param {FocusTreeId} focusTreeId Id of focus tree component thinks it's apart of
     * @param {ComponentId} componentId Index of the component that is currently handling
     *        the keyboard event
     * @private
     */

  }, {
    key: "_callHandlerIfActionNotHandled",
    value: function _callHandlerIfActionNotHandled(event, keyName, keyEventType, componentId, focusTreeId) {
      var eventName = describeKeyEventType(keyEventType);

      var combinationName = this._describeCurrentCombination();

      if (!this.componentList.anyActionsForEventType(keyEventType)) {
        this.logger.logIgnoredEvent("'".concat(combinationName, "' ").concat(eventName), "it doesn't have any ".concat(eventName, " handlers"), componentId);
        return;
      }

      if (this.eventPropagator.isHandled()) {
        this.logger.logIgnoredEvent("'".concat(combinationName, "' ").concat(eventName), 'it has already been handled', componentId);
      } else {
        this.logger.verbose(this.logger.keyEventPrefix(componentId, {
          focusTreeId: focusTreeId
        }), "Attempting to find action matching '".concat(combinationName, "' ").concat(eventName, " . . ."));
        var previousPosition = this.eventPropagator.previousPosition;
        var componentPosition = this.componentList.getPositionById(componentId);
        var handlerWasCalled = this.actionResolver.callClosestMatchingHandler(event, keyName, keyEventType, componentPosition, previousPosition === -1 ? 0 : previousPosition);

        if (handlerWasCalled) {
          this.eventPropagator.setHandled();
        }
      }
    }
  }]);

  return FocusOnlyKeyEventStrategy;
}(AbstractKeyEventStrategy);

export default FocusOnlyKeyEventStrategy;