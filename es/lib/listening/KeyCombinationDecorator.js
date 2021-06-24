function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import dictionaryFrom from '../../utils/object/dictionaryFrom';

var KeyCombinationDecorator = /*#__PURE__*/function () {
  function KeyCombinationDecorator(keyCombination) {
    _classCallCheck(this, KeyCombinationDecorator);

    this._keyCombination = keyCombination;
  }
  /**
   * Return a serialized description of the keys in the combination
   * @returns {KeySequence}
   */


  _createClass(KeyCombinationDecorator, [{
    key: "describe",
    value: function describe() {
      return this._keyCombination.ids[0];
    }
    /**
     * Dictionary of keys included in the combination record
     * @returns {Object.<ReactKeyName, boolean>}
     */

  }, {
    key: "asKeyDictionary",
    value: function asKeyDictionary() {
      return dictionaryFrom(this._keyCombination.keys);
    }
    /**
     * A plain JavaScript representation of the key combination record, useful for
     * serialization or debugging
     * @returns {Object} Serialized representation of the combination record
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        keys: this._keyCombination.keyStates,
        ids: this._keyCombination.ids,
        keyAliases: this._keyCombination.keyAliases
      };
    }
  }]);

  return KeyCombinationDecorator;
}();

export default KeyCombinationDecorator;