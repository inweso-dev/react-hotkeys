"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _KeyEventStateArrayManager = _interopRequireDefault(require("../shared/KeyEventStateArrayManager"));

var _indexFromEnd = _interopRequireDefault(require("../../utils/array/indexFromEnd"));

var _KeyCombinationMatcher = _interopRequireDefault(require("./KeyCombinationMatcher"));

var _KeyEventState = _interopRequireDefault(require("../../const/KeyEventState"));

var _lazyLoadAttribute = _interopRequireDefault(require("../../utils/object/lazyLoadAttribute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function updateIndexCounters(indexCounters, idSizes) {
  /**
   * Cycle through the list of different combination aliases
   */
  var incrementer = 0;
  var carry = true;

  while (carry && incrementer < indexCounters.length) {
    var count = (0, _indexFromEnd["default"])(indexCounters, incrementer);
    var newIndex = (count + 1) % ((0, _indexFromEnd["default"])(idSizes, incrementer) || 1);
    indexCounters[indexCounters.length - (incrementer + 1)] = newIndex;
    carry = newIndex === 0;

    if (carry) {
      incrementer++;
    }
  }

  return incrementer === indexCounters.length;
}
/**
 * Matches a KeyHistory to a list of pre-registered ActionConfiguration and
 * their corresponding handler functions
 * @class
 */


var KeyHistoryMatcher = /*#__PURE__*/function () {
  /**
   * Returns a new instance of KeyMapMatcher
   * @returns {KeyHistoryMatcher}
   */
  function KeyHistoryMatcher() {
    _classCallCheck(this, KeyHistoryMatcher);

    this._combinationMatchers = {};
    this._eventRecord = _KeyEventStateArrayManager["default"].newRecord();
  }
  /**
   * Adds a possible match that can be used to match key combination histories
   * @param {ActionConfiguration} actionConfig The configuration object that
   *        defines the action the possible match represents
   * @param {Function} handler Function to call if the possible match is selected
   *        when matching against a key combination history
   * @returns {void}
   */


  _createClass(KeyHistoryMatcher, [{
    key: "addMatch",
    value: function addMatch(actionConfig, handler) {
      var combinationMatcher = this._getOrCreateCombinationMatcher(actionConfig.prefix);

      combinationMatcher.addMatch(actionConfig, handler);
      /**
       * Merge event records so we can quickly determine if a given component
       * has any handlers bound to particular key events
       */

      _KeyEventStateArrayManager["default"].setBit(this._eventRecord, actionConfig.keyEventType, _KeyEventState["default"].seen);
      /**
       * Record the longest sequence length so we know to only check for sequences
       * of that length or shorter for a particular component
       */


      if (!this.longestSequence || this.longestSequence < actionConfig.sequenceLength) {
        this.longestSequence = actionConfig.sequenceLength;
      }
    }
    /**
     * Attempts to find a match from the list of possible matches previously registered
     * for a given key event and key combination history
     * @param {KeyHistory} keyHistory History to attempt to
     *        find a match for
     * @param {ReactKeyName} key Name of the key to find a match for
     * @param {KeyEventType} keyEventType Type of event to find a match
     * @returns {MatchingActionConfig|null} First MatchingActionOptions that matches
     */

  }, {
    key: "findMatch",
    value: function findMatch(keyHistory, key, keyEventType) {
      var combinationMatcher = this._findCombinationMatcher(keyHistory);

      if (combinationMatcher) {
        return combinationMatcher.findMatch(keyHistory.currentCombination, keyHistory.currentCombination.getNormalizedKeyName(key), keyEventType);
      }

      return null;
    }
    /**
     * Whether a possible match has been registered for a key event type
     * @param {KeyEventType} eventType Type of event
     * @returns {boolean} true if at least one possible match has been registered for
     *        the event
     */

  }, {
    key: "hasMatchesForEventType",
    value: function hasMatchesForEventType(eventType) {
      return !!this._eventRecord[eventType];
    }
    /********************************************************************************
     * Presentation
     ********************************************************************************/

    /**
     * A plain JavaScript representation of the KeyMapMatcher, useful for
     * serialization or debugging
     * @returns {Object} Serialized representation of the key map matcher
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      var _this = this;

      return Object.keys(this._combinationMatchers).reduce(function (memo, prefix) {
        var combinationMatcher = _this._combinationMatchers[prefix];
        memo[prefix] = combinationMatcher.toJSON();
        return memo;
      }, {});
    }
    /********************************************************************************
     * Private methods
     ********************************************************************************/

  }, {
    key: "_getOrCreateCombinationMatcher",
    value: function _getOrCreateCombinationMatcher(prefix) {
      return (0, _lazyLoadAttribute["default"])(this._combinationMatchers, prefix, function () {
        return new _KeyCombinationMatcher["default"]();
      });
    }
  }, {
    key: "_findCombinationMatcher",
    value: function _findCombinationMatcher(keyHistory) {
      var previousCombinations = keyHistory.getPreviousCombinations(this.longestSequence - 1);

      if (previousCombinations.length === 0) {
        return this._combinationMatchers[''];
      }
      /**
       * We need to match a sequence, and therefore try all the aliases involved in
       * each key combination that makes up the sequence, to be sure there isn't a
       * match
       */


      var sequenceIds = previousCombinations.map(function (keyCombination) {
        return keyCombination.ids;
      });
      var idSizes = sequenceIds.map(function (ids) {
        return ids.length;
      });
      /**
       * List of counters
       * @type {number[]}
       */

      var indexCounters = new Array(sequenceIds.length).fill(0);

      do {
        var sequenceIdPermutation = indexCounters.map(function (sequenceIdIndex, index) {
          return sequenceIds[index][sequenceIdIndex];
        });
        var candidateId = sequenceIdPermutation.join(' ');

        if (this._combinationMatchers[candidateId]) {
          return this._combinationMatchers[candidateId];
        }
      } while (!updateIndexCounters(indexCounters, idSizes));

      return this._combinationMatchers[''];
    }
  }]);

  return KeyHistoryMatcher;
}();

var _default = KeyHistoryMatcher;
exports["default"] = _default;