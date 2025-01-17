"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Registry2 = _interopRequireDefault(require("../shared/Registry"));

var _without = _interopRequireDefault(require("../../utils/collection/without"));

var _isUndefined = _interopRequireDefault(require("../../utils/isUndefined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/**
 * @typedef {Object} ComponentRegistryEntry
 * @property {ComponentId[]} childIds List of ids of the children of a component
 * @property {ComponentId|null} parentIds Id of the parent component
 */

/**
 * Registry of hot keys components, mapping children to their parents and vice versa
 * @class
 */
var ComponentTree = /*#__PURE__*/function (_Registry) {
  _inherits(ComponentTree, _Registry);

  var _super = _createSuper(ComponentTree);

  function ComponentTree() {
    var _this;

    _classCallCheck(this, ComponentTree);

    _this = _super.call(this);

    _this.clearRootId();

    return _this;
  }

  _createClass(ComponentTree, [{
    key: "hasRoot",
    value: function hasRoot() {
      return !this.isRootId(null);
    }
  }, {
    key: "isRootId",
    value: function isRootId(componentId) {
      return componentId === this.rootId;
    }
  }, {
    key: "clearRootId",
    value: function clearRootId() {
      this.rootId = null;
    }
    /**
     * Register a component
     * @param {ComponentId} componentId Id of the component to register
     * @param {KeyMap} keyMap - Map of actions to key expressions
     * @returns {void}
     */

  }, {
    key: "add",
    value: function add(componentId, keyMap) {
      _get(_getPrototypeOf(ComponentTree.prototype), "set", this).call(this, componentId, {
        childIds: [],
        parentId: null,
        keyMap: keyMap
      });
    }
    /**
     * Updates an existing component's key map
     * @param {ComponentId} componentId Id of the component to register
     * @param {KeyMap} keyMap - Map of actions to key expressions
     * @returns {void}
     */

  }, {
    key: "update",
    value: function update(componentId, keyMap) {
      var component = _get(_getPrototypeOf(ComponentTree.prototype), "get", this).call(this, componentId);

      _get(_getPrototypeOf(ComponentTree.prototype), "set", this).call(this, componentId, _objectSpread(_objectSpread({}, component), {}, {
        keyMap: keyMap
      }));
    }
    /**
     * Set the parent ID of a component
     * @param {ComponentId} componentId Id of the component
     * @param {ComponentId} parentId Id of the parent
     * @returns {void}
     */

  }, {
    key: "setParent",
    value: function setParent(componentId, parentId) {
      if (!(0, _isUndefined["default"])(parentId)) {
        this.get(componentId).parentId = parentId;

        this._addChildId(parentId, componentId);
      } else {
        this.rootId = componentId;
      }
    }
    /**
     * Deregister a component
     * @param {ComponentId} componentId Id of the component to remove
     * @returns {void}
     */

  }, {
    key: "remove",
    value: function remove(componentId) {
      var parentId = this._getParentId(componentId);

      this._removeChildId(parentId, componentId);

      _get(_getPrototypeOf(ComponentTree.prototype), "remove", this).call(this, componentId);
    }
    /********************************************************************************
     * Private methods
     ********************************************************************************/

  }, {
    key: "_getParentId",
    value: function _getParentId(componentId) {
      var component = this.get(componentId);
      return component && component.parentId;
    }
  }, {
    key: "_addChildId",
    value: function _addChildId(parentId, componentId) {
      this.get(parentId).childIds.push(componentId);
    }
  }, {
    key: "_removeChildId",
    value: function _removeChildId(parentId, childId) {
      var parent = this.get(parentId);

      if (parent) {
        parent.childIds = (0, _without["default"])(parent.childIds, childId);
      }
    }
  }]);

  return ComponentTree;
}(_Registry2["default"]);

var _default = ComponentTree;
exports["default"] = _default;