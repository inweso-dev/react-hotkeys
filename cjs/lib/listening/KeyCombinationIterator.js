"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _size = _interopRequireDefault(require("../../utils/collection/size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyCombinationIterator = /*#__PURE__*/function () {
  function KeyCombinationIterator(keyCombination) {
    _classCallCheck(this, KeyCombinationIterator);

    this._keyCombination = keyCombination;
  }
  /**
   * Whether there are any keys in the combination
   * @returns {boolean} true if there is 1 or more keys involved in the combination,
   *          else false.
   */


  _createClass(KeyCombinationIterator, [{
    key: "any",
    value: function any() {
      return this._getKeys().length > 0;
    }
    /**
     * Number of keys involved in the combination
     * @type {number} Number of keys
     */

  }, {
    key: "numberOfKeys",
    get: function get() {
      return (0, _size["default"])(this._getKeys());
    }
    /**
     * @callback forEachHandler
     * @param {ReactKeyName} keyName Name of a key in the combination
     * @returns {void}
     */

    /**
     * Iterates over every key in the combination, calling an function with each
     * key name
     * @param {forEachHandler} handler Function to call with the name of each key
     *        in the combination
     * @returns {void}
     */

  }, {
    key: "forEachKey",
    value: function forEachKey(handler) {
      return this._getKeys().forEach(handler);
    }
    /**
     * @callback evaluator
     * @param {ReactKeyName} keyName Name of a key in the combination
     * @returns {boolean}
     */

    /**
     * Whether at least one of the keys causes a evaluator function to return true
     * @callback {evaluator} evaluator Function to evaluate each key
     * @returns {boolean} Whether at least one key satisfies the evaluator
     */

  }, {
    key: "some",
    value: function some(evaluator) {
      return this._getKeys().some(evaluator);
    }
  }, {
    key: "_getKeys",
    value: function _getKeys() {
      return this._keyCombination.keys;
    }
  }]);

  return KeyCombinationIterator;
}();

var _default = KeyCombinationIterator;
exports["default"] = _default;