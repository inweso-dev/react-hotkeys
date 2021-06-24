"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _withHotKeysIgnoreOverride = _interopRequireDefault(require("./withHotKeysIgnoreOverride"));

var _overrideComponent = _interopRequireDefault(require("./lib/overrideComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * A component that forces React Hotkeys to observe all matching key events
 * triggered by its children, even if they are matched by Configuration.ignoreEventsCondition.
 * By default, this is all key events, but you can use the only prop to provide a
 * whitelist, or the except prop to pass a blacklist.
 *
 * @see HotKeysIgnoreOverride
 */
var _default = (0, _withHotKeysIgnoreOverride["default"])((0, _overrideComponent["default"])('ObserveKeys'), {}, 'observeIgnoredEvents');

exports["default"] = _default;