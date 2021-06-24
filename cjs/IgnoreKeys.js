"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _withHotKeysIgnoreOverride = _interopRequireDefault(require("./withHotKeysIgnoreOverride"));

var _overrideComponent = _interopRequireDefault(require("./lib/overrideComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * A component that causes React Hotkeys to ignore all matching key events
 * triggered by its children. By default, this is all key events, but you can use
 * the only prop to provide a whitelist, or the except prop to pass a blacklist (and
 * cause HotKeys components to still observe these events).
 *
 * @see HotKeysIgnoreOverride
 */
var _default = (0, _withHotKeysIgnoreOverride["default"])((0, _overrideComponent["default"])('IgnoreKeys'), {}, 'ignoreEvent');

exports["default"] = _default;