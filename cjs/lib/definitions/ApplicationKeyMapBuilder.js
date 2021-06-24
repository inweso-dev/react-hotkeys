"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isObject = _interopRequireDefault(require("../../utils/object/isObject"));

var _hasKey = _interopRequireDefault(require("../../utils/object/hasKey"));

var _copyAttributes = _interopRequireDefault(require("../../utils/object/copyAttributes"));

var _arrayFrom = _interopRequireDefault(require("../../utils/array/arrayFrom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SEQUENCE_ATTRIBUTES = ['sequence', 'action'];
var KEYMAP_ATTRIBUTES = ['name', 'description', 'group'];

function createSequenceFromConfig(keyMapConfig) {
  return (0, _arrayFrom["default"])(keyMapConfig).map(function (sequenceOrKeyMapOptions) {
    if ((0, _isObject["default"])(sequenceOrKeyMapOptions)) {
      /**
       * Support syntax:
       * [
       *   { sequence: 'a+b', action: 'keyup' },
       *   { sequence: 'c' }
       * ]
       */
      return (0, _copyAttributes["default"])(sequenceOrKeyMapOptions, {}, SEQUENCE_ATTRIBUTES);
    } else {
      /**
       * Support syntax:
       * 'a+b'
       */
      return {
        sequence: sequenceOrKeyMapOptions
      };
    }
  });
}

function normalizeActionDefinition(keyMap, actionName, keyMapSummary) {
  var keyMapConfig = keyMap[actionName];
  keyMapSummary[actionName] = {};

  if ((0, _isObject["default"])(keyMapConfig)) {
    if ((0, _hasKey["default"])(keyMapConfig, 'sequences')) {
      /**
       * Support syntax:
       *  {
       *    sequences: [ {sequence: 'a+b', action: 'keyup' }],
       *    name: 'My keymap',
       *    description: 'Key to press for something special',
       *    group: 'Vanity'
       *  }
       */
      (0, _copyAttributes["default"])(keyMapConfig, keyMapSummary[actionName], KEYMAP_ATTRIBUTES);
      keyMapSummary[actionName].sequences = createSequenceFromConfig(keyMapConfig.sequences);
    } else {
      /**
       * Support syntax:
       * {
       *   sequence: 'a+b', action: 'keyup',
       *   name: 'My keymap',
       *   description: 'Key to press for something special',
       *   group: 'Vanity'
       * }
       */
      (0, _copyAttributes["default"])(keyMapConfig, keyMapSummary[actionName], KEYMAP_ATTRIBUTES);
      keyMapSummary[actionName].sequences = [(0, _copyAttributes["default"])(keyMapConfig, {}, SEQUENCE_ATTRIBUTES)];
    }
  } else {
    keyMapSummary[actionName].sequences = createSequenceFromConfig(keyMapConfig);
  }
}

var ApplicationKeyMapBuilder = /*#__PURE__*/function () {
  function ApplicationKeyMapBuilder(componentTree) {
    _classCallCheck(this, ApplicationKeyMapBuilder);

    this._componentTree = componentTree;
  }

  _createClass(ApplicationKeyMapBuilder, [{
    key: "build",
    value: function build() {
      if (!this._componentTree.hasRoot()) {
        return {};
      }

      return this._build([this._componentTree.rootId], {});
    }
  }, {
    key: "_build",
    value: function _build(componentIds, keyMapSummary) {
      var _this = this;

      componentIds.forEach(function (componentId) {
        var _this$_componentTree$ = _this._componentTree.get(componentId),
            childIds = _this$_componentTree$.childIds,
            keyMap = _this$_componentTree$.keyMap;

        if (keyMap) {
          Object.keys(keyMap).forEach(function (actionName) {
            normalizeActionDefinition(keyMap, actionName, keyMapSummary);
          });
        }

        _this._build(childIds, keyMapSummary);
      });
      return keyMapSummary;
    }
  }]);

  return ApplicationKeyMapBuilder;
}();

var _default = ApplicationKeyMapBuilder;
exports["default"] = _default;