"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dictionaryFrom = _interopRequireDefault(require("../object/dictionaryFrom"));

var _arrayFrom = _interopRequireDefault(require("../array/arrayFrom"));

var _isObject = _interopRequireDefault(require("../object/isObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Return a new collection, with the same elements as another, with the specified
 * exceptions
 * @param {Object|Array} target The collection to duplicate
 * @param {*} exclusions The attributes to omit when the collection is an object, or
 *        the elements to exclude if the collection is an array
 * @param {Object} options Configuration options
 * @param {boolean} options.stringifyFirst Whether to stringify the elements of the
 *        arrays before comparing them to the exclusion list
 * @returns {Object|Array} Copied collection without the specified elements
 */
function without(target) {
  var exclusions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var omitDict = (0, _dictionaryFrom["default"])((0, _arrayFrom["default"])(exclusions), function (value) {
    return {
      value: value
    };
  });

  if (Array.isArray(target)) {
    return target.reduce(function (memo, element) {
      if (!(omitDict[element] && (options.stringifyFirst || omitDict[element].value === element))) {
        memo.push(element);
      }

      return memo;
    }, []);
  } else if ((0, _isObject["default"])(target)) {
    return Object.keys(target).reduce(function (memo, key) {
      if (!omitDict[key]) {
        memo[key] = target[key];
      }

      return memo;
    }, {});
  } else {
    return target;
  }
}

var _default = without;
exports["default"] = _default;