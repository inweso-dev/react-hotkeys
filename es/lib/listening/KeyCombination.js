function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import KeyEventSequenceIndex from '../../const/KeyEventSequenceIndex';
import KeyEventType from '../../const/KeyEventType';
import KeyCombinationSerializer from '../shared/KeyCombinationSerializer';
import resolveKeyAlias from '../../helpers/resolving-handlers/resolveKeyAlias';
import applicableAliasFunctions from '../../helpers/resolving-handlers/applicableAliasFunctions';
import KeyEventStateArrayManager from '../shared/KeyEventStateArrayManager';
import isEmpty from '../../utils/collection/isEmpty';
import KeyEventState from '../../const/KeyEventState';
import lazyLoadAttribute from '../../utils/object/lazyLoadAttribute';
import ModifierFlagsDictionary from '../../const/ModifierFlagsDictionary';
import stateFromEvent from '../../helpers/parsing-key-maps/stateFromEvent';
/**
 * Record of one or more keys pressed together, in a combination
 * @class
 */

var KeyCombination = /*#__PURE__*/function () {
  /**
   * Creates a new KeyCombination instance
   * @param {Object.<ReactKeyName, Array.<KeyEventState[]>>} keys Dictionary
   *        of keys
   * @returns {KeyCombination}
   */
  function KeyCombination() {
    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, KeyCombination);

    this.keyStates = keys;
    /**
     * Whether combination includes key up
     * @type {boolean}
     */

    this.isEnding = false;
    this._keyAliases = undefined;
    this._ids = undefined;
  }
  /********************************************************************************
   * Getters
   *********************************************************************************/

  /**
   * List of ids (serialized representations) for the keys involved in the combination
   * @type {KeySequence[]} List of combination ids
   */


  _createClass(KeyCombination, [{
    key: "ids",
    get: function get() {
      var _this = this;

      return lazyLoadAttribute(this, '_ids', function () {
        return KeyCombinationSerializer.serialize(_this.keyStates);
      });
    }
    /**
     * Dictionary mapping keys to their acceptable aliases. This includes "shifted" or
     * "alted" key characters.
     * @returns {Object.<ReactKeyName, ReactKeyName[]>}
     */

  }, {
    key: "keyAliases",
    get: function get() {
      var _this2 = this;

      return lazyLoadAttribute(this, '_keyAliases', function () {
        return buildKeyAliases(_this2.keyStates);
      });
    }
    /**
     * A normalized version of the key, achieved by comparing it to the list of known
     * aliases for the keys in the combination
     * @param {ReactKeyName} keyName Name of the key to normalize
     * @returns {ReactKeyName} Normalized key name
     */

  }, {
    key: "getNormalizedKeyName",
    value: function getNormalizedKeyName(keyName) {
      var keyState = this.keyStates[keyName];

      if (keyState) {
        return keyName;
      } else {
        var keyAlias = this.keyAliases[keyName];

        if (keyAlias) {
          return keyAlias;
        } else {
          return keyName;
        }
      }
    }
    /********************************************************************************
     * Query attributes of entire combination
     *********************************************************************************/

    /**
     * Whether there are any keys in the current combination still being pressed
     * @returns {boolean} True if all keys in the current combination are released
     */

  }, {
    key: "hasEnded",
    value: function hasEnded() {
      return isEmpty(this.keysStillPressedDict());
    }
    /********************************************************************************
     * Adding & modifying key states
     *********************************************************************************/

    /**
     * Add a new key to the combination (starting with a state of keydown)
     * @param {ReactKeyName} keyName Name of key
     * @param {KeyEventState} keyEventState State key is in
     * @returns {void}
     */

  }, {
    key: "addKey",
    value: function addKey(keyName, keyEventState) {
      this._setKeyState(keyName, [KeyEventStateArrayManager.newRecord(), KeyEventStateArrayManager.newRecord(KeyEventType.keydown, keyEventState)]);
    }
    /**
     * Adds a key event to the current key combination (as opposed to starting a new
     * keyboard combination).
     * @param {ReactKeyName} keyName - Name of the key to add to the current combination
     * @param {KeyEventType} recordIndex - Index in record to set to true
     * @param {KeyEventState} keyEventState The state to set the key event to
     */

  }, {
    key: "setKeyState",
    value: function setKeyState(keyName, recordIndex, keyEventState) {
      var existingRecord = this._getKeyState(keyName);

      if (this.isKeyIncluded(keyName)) {
        var previous = KeyEventStateArrayManager.clone(existingRecord[1]);
        var current = KeyEventStateArrayManager.clone(previous);
        KeyEventStateArrayManager.setBit(current, recordIndex, keyEventState);

        this._setKeyState(keyName, [previous, current]);
      } else {
        this.addKey(keyName, keyEventState);
      }

      if (recordIndex === KeyEventType.keyup) {
        this.isEnding = true;
      }
    }
    /********************************************************************************
     * Iteration and subsets
     *********************************************************************************/

    /**
     * Returns a new KeyCombination without the keys that have been
     * released (had the keyup event recorded). Essentially, the keys that are
     * currently still pressed down at the time a key event is being handled.
     * @returns {KeyCombination} New KeyCombination with all of the
     *        keys with keyup events omitted
     */

  }, {
    key: "keysStillPressedDict",
    value: function keysStillPressedDict() {
      var _this3 = this;

      return this.keys.reduce(function (memo, keyName) {
        if (_this3.isKeyStillPressed(keyName)) {
          memo[keyName] = _this3._getKeyState(keyName);
        }

        return memo;
      }, {});
    }
    /********************************************************************************
     * Query individual keys
     *********************************************************************************/

    /**
     * Whether key is in the combination
     * @param {ReactKeyName} keyName Name of key
     * @returns {boolean} true if the key is in the combination
     */

  }, {
    key: "isKeyIncluded",
    value: function isKeyIncluded(keyName) {
      return !!this._getKeyState(keyName);
    }
    /**
     * Whether key is in the combination and has yet to be released
     * @param {ReactKeyName} keyName Name of key
     * @returns {boolean} true if the key is in the combination and yet to be released
     */

  }, {
    key: "isKeyStillPressed",
    value: function isKeyStillPressed(keyName) {
      return this.isEventTriggered(keyName, KeyEventType.keypress) && !this.isKeyReleased(keyName);
    }
    /**
     * Whether key is in the combination and been released
     * @param {ReactKeyName} keyName Name of key
     * @returns {boolean} true if the key is in the combination and has been released
     */

  }, {
    key: "isKeyReleased",
    value: function isKeyReleased(keyName) {
      return this.isEventTriggered(keyName, KeyEventType.keyup);
    }
    /**
     * Whether an event has been recorded for a key yet
     * @param {ReactKeyName} keyName Name of the key
     * @param {KeyEventType} keyEventType Index of the event type
     * @returns {boolean} true if the event has been recorded for the key
     */

  }, {
    key: "isEventTriggered",
    value: function isEventTriggered(keyName, keyEventType) {
      return this._getKeyStateType(keyName, KeyEventSequenceIndex.current, keyEventType);
    }
    /**
     * Whether an event has been previously recorded for a key (the second most recent
     * event to occur for the key)
     * @param {ReactKeyName} keyName Name of the key
     * @param {KeyEventType} keyEventType Index of the event type
     * @returns {boolean} true if the event has been previously recorded for the key
     */

  }, {
    key: "wasEventPreviouslyTriggered",
    value: function wasEventPreviouslyTriggered(keyName, keyEventType) {
      return this._getKeyStateType(keyName, KeyEventSequenceIndex.previous, keyEventType);
    }
    /**
     * Whether a keypress event is currently being simulated
     * @param {ReactKeyName} keyName Name of the key
     * @returns {boolean} true if the keypress event is currently being simulated for the
     *        key
     */

  }, {
    key: "isKeyPressSimulated",
    value: function isKeyPressSimulated(keyName) {
      return this.isEventTriggered(keyName, KeyEventType.keypress) === KeyEventState.simulated;
    }
    /**
     * Whether a keyup event is currently being simulated
     * @param {ReactKeyName} keyName Name of the key
     * @returns {boolean} true if the keyup event is currently being simulated for the
     *        key
     */

  }, {
    key: "isKeyUpSimulated",
    value: function isKeyUpSimulated(keyName) {
      return this.isEventTriggered(keyName, KeyEventType.keyup) === KeyEventState.simulated;
    }
    /**
     * Synchronises the key combination history to match the modifier key flag attributes
     * on new key events
     * @param {KeyboardEvent|SyntheticKeyboardEvent} event - Event to check the modifier flags for
     * @param {string} key - Name of key that events relates to
     * @param {KeyEventType} keyEventType - The record index of the current
     *        key event type
     */

  }, {
    key: "resolveModifierFlagDiscrepancies",
    value: function resolveModifierFlagDiscrepancies(event, key, keyEventType) {
      var _this4 = this;

      /**
       * If a new key event is received with modifier key flags that contradict the
       * key combination history we are maintaining, we can surmise that some keyup events
       * for those modifier keys have been lost (possibly because the window lost focus).
       * We update the key combination to match the modifier flags
       */
      Object.keys(ModifierFlagsDictionary).forEach(function (modifierKey) {
        /**
         * When a modifier key is being released (keyup), it sets its own modifier flag
         * to false. (e.g. On the keyup event for Command, the metaKey attribute is false).
         * If this the case, we want to handle it using the main algorithm and skip the
         * reconciliation algorithm.
         */
        if (key === modifierKey && keyEventType === KeyEventType.keyup) {
          return;
        }

        var modifierStillPressed = _this4.isKeyStillPressed(modifierKey);

        ModifierFlagsDictionary[modifierKey].forEach(function (attributeName) {
          if (event[attributeName] === false && modifierStillPressed) {
            _this4.setKeyState(modifierKey, KeyEventType.keyup, stateFromEvent(event));
          }
        });
      });
    }
  }, {
    key: "keys",
    get: function get() {
      return Object.keys(this.keyStates);
    }
    /********************************************************************************
     * Private methods
     *********************************************************************************/

  }, {
    key: "_getKeyStateType",
    value: function _getKeyStateType(keyName, keyStage, keyEventType) {
      var keyState = this._getKeyState(keyName);

      return keyState && keyState[keyStage][keyEventType];
    }
  }, {
    key: "_getKeyState",
    value: function _getKeyState(keyName) {
      var keyState = this.keyStates[keyName];

      if (keyState) {
        return keyState;
      } else {
        var keyAlias = this.keyAliases[keyName];

        if (keyAlias) {
          return this.keyStates[keyAlias];
        }
      }
    }
  }, {
    key: "_setKeyState",
    value: function _setKeyState(keyName, keyState) {
      var keyAlias = this.getNormalizedKeyName(keyName);
      this.keyStates[keyAlias] = keyState;
      delete this._keyAliases;
      delete this._ids;
    }
  }]);

  return KeyCombination;
}();

function buildKeyAliases(keyDictionary) {
  return Object.keys(keyDictionary).reduce(function (memo, keyName) {
    resolveKeyAlias(keyName).forEach(function (normalizedKey) {
      applicableAliasFunctions(keyDictionary).forEach(function (aliasFunction) {
        aliasFunction(normalizedKey).forEach(function (keyAlias) {
          if (keyAlias !== keyName || keyName !== normalizedKey) {
            memo[keyAlias] = keyName;
          }
        });
      });
    });
    return memo;
  }, {});
}

export default KeyCombination;