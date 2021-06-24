"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _KeyHistoryMatcher = _interopRequireDefault(require("./KeyHistoryMatcher"));

var _lazyLoadAttribute = _interopRequireDefault(require("../../utils/object/lazyLoadAttribute"));

var _printComponent = _interopRequireDefault(require("../../helpers/logging/printComponent"));

var _Configuration = _interopRequireDefault(require("../config/Configuration"));

var _KeyCombinationSerializer = _interopRequireDefault(require("../shared/KeyCombinationSerializer"));

var _describeKeyEventType = _interopRequireDefault(require("../../helpers/logging/describeKeyEventType"));

var _KeyCombinationDecorator = _interopRequireDefault(require("../listening/KeyCombinationDecorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Resolves the correct actions to trigger for a list of hotkeys components and a
 * history of key events
 * @class
 */
var ActionResolver = /*#__PURE__*/function () {
  /**
   * Creates a new instance of ActionResolver
   * @param {ComponentOptionsList} componentList List of components
   * @param {AbstractKeyEventStrategy} eventStrategy
   * @param {Logger} logger
   * @returns {ActionResolver}
   */
  function ActionResolver(componentList, eventStrategy, logger) {
    _classCallCheck(this, ActionResolver);

    this.logger = logger;
    this._eventStrategy = eventStrategy;
    /**
     * List of mappings from key sequences to handlers that is constructed on-the-fly
     * as key events propagate up the render tree
     * @type {KeyHistoryMatcher[]}
     */

    this._keyMapMatchers = [];
    /**
     * Array of counters - one for each component - to keep track of how many handlers
     * for that component still need actions assigned to them
     * @type {Array.<Number,Object>}
     */

    this._unmatchedHandlerStatus = [];
    /**
     * A dictionary mapping action names to the position in the list of the components
     * that define handlers for them
     * @type {Object.<ActionName, Number[]>}
     */

    this._handlersDictionary = {};
    /**
     * A dictionary of sequences already encountered in the process of building the
     * list of keyMaps on the fly, as key events propagate up the component tree
     * @type {Object.<MouseTrapKeySequence, Number[]>}
     */

    this._keySequencesDictionary = {};
    var iterator = componentList.iterator;

    while (iterator.next()) {
      var _iterator$getComponen = iterator.getComponent(),
          handlers = _iterator$getComponen.handlers;

      this._unmatchedHandlerStatus.push([Object.keys(handlers).length, {}]);

      this._keyMapMatchers.push(new _KeyHistoryMatcher["default"]());
    }

    this._componentList = componentList;
    this._componentListIterator = componentList.iterator;
  }
  /**
   * The KeyHistoryMatcher for the component in a particular position
   * @param {number} componentPosition Position of component to find the
   *        KeyHistoryMatcher for
   * @returns {KeyHistoryMatcher} Key combination matcher that corresponds
   *        to the component
   */


  _createClass(ActionResolver, [{
    key: "getKeyHistoryMatcher",
    value: function getKeyHistoryMatcher(componentPosition) {
      if (this._componentHasUnmatchedHandlers(componentPosition)) {
        /**
         * We build the mapping between actions and their closest handlers the
         * first time the key map for the component at <tt>position</tt> is accessed.
         *
         * We must search higher than the current component for actions, as they are
         * often defined in parent components of those that ultimately define their
         * handlers.
         */
        while (this._componentListIterator.next()) {
          this._addHandlersFromComponent();

          this._addActionsFromComponent();
        }
      }

      return this._getKeyHistoryMatcher(componentPosition);
    }
    /**
     * Whether a component has one or more actions bound to an event type
     * @param {number} componentPosition Position of the component
     * @param {KeyEventType} keyEventType
     * @returns {boolean} true if the component has an action bound to the event type
     */

  }, {
    key: "componentHasActionsBoundToEventType",
    value: function componentHasActionsBoundToEventType(componentPosition, keyEventType) {
      return this.getKeyHistoryMatcher(componentPosition).hasMatchesForEventType(keyEventType);
    }
    /**
     * Finds matcher for sequence and current key event for a component at a position
     * @param {number} componentPosition Position of the component
     * @param {KeyHistory} keyHistory History of key combinations to match
     *        against actions defined in component
     * @param {ReactKeyName} keyName Name of the key the current event relates to
     * @param {KeyEventType} keyEventType Type of key event
     * @returns {Object|null}
     */

  }, {
    key: "findMatchingKeySequenceInComponent",
    value: function findMatchingKeySequenceInComponent(componentPosition, keyHistory, keyName, keyEventType) {
      if (!this.componentHasActionsBoundToEventType(componentPosition, keyEventType)) {
        return null;
      }

      return this.getKeyHistoryMatcher(componentPosition).findMatch(keyHistory, keyName, keyEventType);
    }
  }, {
    key: "callClosestMatchingHandler",
    value: function callClosestMatchingHandler(event, keyName, keyEventType, componentPosition, componentSearchIndex) {
      while (componentSearchIndex <= componentPosition) {
        var keyHistoryMatcher = this.getKeyHistoryMatcher(componentSearchIndex);

        var _this$_eventStrategy$ = this._eventStrategy.componentList.getAtPosition(componentSearchIndex),
            componentId = _this$_eventStrategy$.componentId;

        this.logger.verbose(this.logger.keyEventPrefix(componentId), 'Internal key mapping:\n', "".concat((0, _printComponent["default"])(keyHistoryMatcher.toJSON())));
        var keyHistory = this._eventStrategy.keyHistory;
        var currentCombination = keyHistory.currentCombination;
        var sequenceMatch = this.findMatchingKeySequenceInComponent(componentSearchIndex, keyHistory, keyName, keyEventType);

        if (sequenceMatch) {
          this._handleMatchFound(currentCombination, sequenceMatch, keyEventType, componentId, event, componentSearchIndex);

          return true;
        }

        this._handleMatchNotFound(currentCombination, componentSearchIndex, keyEventType, componentId);

        componentSearchIndex++;
      }
    }
  }, {
    key: "_handleMatchNotFound",
    value: function _handleMatchNotFound(currentCombination, componentSearchIndex, keyEventType, componentId) {
      var keyCombinationDecorator = new _KeyCombinationDecorator["default"](currentCombination);

      if (this.componentHasActionsBoundToEventType(componentSearchIndex, keyEventType)) {
        var eventName = (0, _describeKeyEventType["default"])(keyEventType);
        this.logger.debug(this.logger.keyEventPrefix(componentId), "No matching actions found for '".concat(keyCombinationDecorator.describe(), "' ").concat(eventName, "."));
      } else {
        this.logger.debug(this.logger.keyEventPrefix(componentId), "Doesn't define a handler for '".concat(keyCombinationDecorator.describe(), "' ").concat((0, _describeKeyEventType["default"])(keyEventType), "."));
      }
    }
  }, {
    key: "_handleMatchFound",
    value: function _handleMatchFound(currentCombination, sequenceMatch, keyEventType, componentId, event, componentSearchIndex) {
      var keyCombinationDecorator = new _KeyCombinationDecorator["default"](currentCombination);
      var eventSchema = sequenceMatch.events[keyEventType];

      if (_Configuration["default"].option('allowCombinationSubmatches')) {
        var subMatchDescription = _KeyCombinationSerializer["default"].serialize(sequenceMatch.keyDictionary);

        this.logger.debug(this.logger.keyEventPrefix(componentId), "Found action that matches '".concat(keyCombinationDecorator.describe(), "' (sub-match: '").concat(subMatchDescription, "'): ").concat(eventSchema.actionName, ". Calling handler . . ."));
      } else {
        this.logger.debug(this.logger.keyEventPrefix(componentId), "Found action that matches '".concat(keyCombinationDecorator.describe(), "': ").concat(eventSchema.actionName, ". Calling handler . . ."));
      }

      eventSchema.handler(event);

      if (_Configuration["default"].option('stopEventPropagationAfterHandling')) {
        this._eventStrategy.stopEventPropagation(event, componentSearchIndex);
      }
    }
    /********************************************************************************
     * Private methods
     *********************************************************************************/

  }, {
    key: "_getKeyHistoryMatcher",
    value: function _getKeyHistoryMatcher(index) {
      return this._keyMapMatchers[index];
    }
  }, {
    key: "_addActionsFromComponent",
    value: function _addActionsFromComponent() {
      var _this = this;

      var _this$_componentListI = this._componentListIterator.getComponent(),
          actions = _this$_componentListI.actions;
      /**
       * Iterate over the actions of a component (starting with the current component
       * and working through its ancestors), matching them to the current component's
       * handlers
       */


      Object.keys(actions).forEach(function (actionName) {
        _this._buildActionMatchers(actionName, actions[actionName]);
      });
    }
  }, {
    key: "_buildActionMatchers",
    value: function _buildActionMatchers(actionName, listOfActionDefinitions) {
      var _this2 = this;

      var handlerPositions = this._positionsOfComponentsWithHandlersFor(actionName);

      if (!handlerPositions) {
        return false;
      }

      this._registerActionWithMatcher(handlerPositions, actionName, listOfActionDefinitions);

      handlerPositions.forEach(function (componentPosition) {
        var handlerStatus = _this2._getUnmatchedHandlerStatus(componentPosition);

        var matchedActionsDictionary = handlerStatus[1];

        if (!matchedActionsDictionary[actionName]) {
          matchedActionsDictionary[actionName] = true;
          /**
           * Decrement the number of remaining unmatched handlers for the
           * component currently handling the propagating key event, so we know
           * when all handlers have been matched to sequences and we can move on
           * to matching them against the current key event
           */

          handlerStatus[0]--;
        }
      });
      return true;
    }
  }, {
    key: "_positionsOfComponentsWithHandlersFor",
    value: function _positionsOfComponentsWithHandlersFor(actionName) {
      return this._handlersDictionary[actionName];
    }
  }, {
    key: "_registerActionWithMatcher",
    value: function _registerActionWithMatcher(handlerPositions, actionName, listOfActionDefinitions) {
      var _this3 = this;

      var positionOfClosestHandler = handlerPositions[0];

      var closestHandler = this._componentList.getAtPosition(positionOfClosestHandler).handlers[actionName];

      var closestKeyMatcher = this._getKeyHistoryMatcher(positionOfClosestHandler);

      listOfActionDefinitions.forEach(function (actionDefinition) {
        var prefix = actionDefinition.prefix,
            id = actionDefinition.id,
            keyEventType = actionDefinition.keyEventType;
        var sequenceId = [prefix, id].join(' ');

        if (_this3._isClosestHandlerAlreadyFoundFor(sequenceId, keyEventType)) {
          return false;
        }

        closestKeyMatcher.addMatch(actionDefinition, closestHandler);

        _this3._recordHandlerFoundFor(sequenceId, [positionOfClosestHandler, keyEventType]);
      });
      return true;
    }
  }, {
    key: "_addHandlersFromComponent",
    value: function _addHandlersFromComponent() {
      var _this4 = this;

      var _this$_componentListI2 = this._componentListIterator.getComponent(),
          handlers = _this$_componentListI2.handlers;
      /**
       * Add current component's handlers to the handlersDictionary so we know
       * which component has defined them
       */


      Object.keys(handlers).forEach(function (actionName) {
        _this4._addHandler(actionName);
      });
    }
  }, {
    key: "_addHandler",
    value: function _addHandler(actionName) {
      (0, _lazyLoadAttribute["default"])(this._handlersDictionary, actionName, []);

      this._handlersDictionary[actionName].push(this._componentListIterator.position);
    }
  }, {
    key: "_recordHandlerFoundFor",
    value: function _recordHandlerFoundFor(keySequence, value) {
      /**
       * Record that we have already found a handler for the current action so
       * that we do not override handlers for an action closest to the event target
       * with handlers further up the tree
       */
      (0, _lazyLoadAttribute["default"])(this._keySequencesDictionary, keySequence, []);

      this._keySequencesDictionary[keySequence].push(value);
    }
  }, {
    key: "_componentHasUnmatchedHandlers",
    value: function _componentHasUnmatchedHandlers(componentIndex) {
      return this._getUnmatchedHandlerStatus(componentIndex)[0] > 0;
    }
  }, {
    key: "_getUnmatchedHandlerStatus",
    value: function _getUnmatchedHandlerStatus(index) {
      return this._unmatchedHandlerStatus[index];
    }
  }, {
    key: "_isClosestHandlerAlreadyFoundFor",
    value: function _isClosestHandlerAlreadyFoundFor(keySequenceId, keyEventType) {
      var keySequence = this._keySequencesDictionary[keySequenceId] || [];
      return keySequence.some(function (dictEntry) {
        return dictEntry[1] === keyEventType;
      });
    }
  }]);

  return ActionResolver;
}();

var _default = ActionResolver;
exports["default"] = _default;