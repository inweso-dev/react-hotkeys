function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import KeyEventManager from '../KeyEventManager';
import isEmpty from '../../utils/collection/isEmpty';
import hasKey from '../../utils/object/hasKey';
import arrayFrom from '../../utils/array/arrayFrom';
import standardizeKeyName from '../../helpers/parsing-key-maps/standardizeKeyName';
import isValidKey, { InvalidKeyNameError } from '../../helpers/parsing-key-maps/isValidKey';
import dictionaryFrom from '../../utils/object/dictionaryFrom';
import resolveAltShiftedAlias from '../../helpers/resolving-handlers/resolveAltShiftedAlias';
import resolveUnaltShiftedAlias from '../../helpers/resolving-handlers/resolveUnaltShiftedAlias';
import resolveShiftedAlias from '../../helpers/resolving-handlers/resolveShiftedAlias';
import resolveUnshiftedAlias from '../../helpers/resolving-handlers/resolveUnshiftedAlias';
import resolveAltedAlias from '../../helpers/resolving-handlers/resolveAltedAlias';
import resolveUnaltedAlias from '../../helpers/resolving-handlers/resolveUnaltedAlias';

var HotKeysIgnoreOverrideManager = /*#__PURE__*/function () {
  function HotKeysIgnoreOverrideManager(eventManagerMethod) {
    _classCallCheck(this, HotKeysIgnoreOverrideManager);

    this._handleKeyEvent = this._handleKeyEvent.bind(this);
    this._eventManagerMethod = eventManagerMethod;
  }

  _createClass(HotKeysIgnoreOverrideManager, [{
    key: "getComponentProps",
    value: function getComponentProps(accessor) {
      var _this = this;

      return {
        onKeyDown: this._handleKeyEvent,
        onKeyPress: this._handleKeyEvent,
        onKeyUp: this._handleKeyEvent,
        onFocus: function onFocus() {
          return _this._reloadDictionaries(accessor());
        }
      };
    }
  }, {
    key: "_reloadDictionaries",
    value: function _reloadDictionaries(_ref) {
      var only = _ref.only,
          except = _ref.except;
      this._onlyDict = keyDictionary(only);
      this._exceptDict = keyDictionary(except);
    }
  }, {
    key: "_handleKeyEvent",
    value: function _handleKeyEvent(event) {
      if (this._shouldIgnoreEvent(event)) {
        KeyEventManager.getInstance()[this._eventManagerMethod](event);
      }
    }
  }, {
    key: "_shouldIgnoreEvent",
    value: function _shouldIgnoreEvent(_ref2) {
      var key = _ref2.key;

      if (isEmpty(this._onlyDict)) {
        if (isEmpty(this._exceptDict)) {
          return true;
        }

        return !hasKey(this._exceptDict, key);
      }

      if (isEmpty(this._exceptDict)) {
        return hasKey(this._onlyDict, key);
      }

      return hasKey(this._onlyDict, key) && !hasKey(this._exceptDict, key);
    }
  }]);

  return HotKeysIgnoreOverrideManager;
}();

function keyDictionary(list) {
  return arrayFrom(list).reduce(function (memo, keyName) {
    var finalKeyName = standardizeKeyName(keyName);

    if (!isValidKey(finalKeyName)) {
      throw new InvalidKeyNameError(keyName);
    }

    dictionaryFrom([resolveAltShiftedAlias, resolveUnaltShiftedAlias, resolveShiftedAlias, resolveUnshiftedAlias, resolveAltedAlias, resolveUnaltedAlias], true, function (func) {
      return func(finalKeyName);
    }, memo);
    return memo;
  }, {});
}

export default HotKeysIgnoreOverrideManager;