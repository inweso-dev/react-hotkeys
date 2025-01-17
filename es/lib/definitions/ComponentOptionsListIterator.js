function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Iterates over ComponentOptionList instances
 * @class
 */
var ComponentOptionsListIterator = /*#__PURE__*/function () {
  /**
   * Creates a new instance of ComponentOptionsListIterator
   * @param {ComponentOptionsList} list The list to iterate over
   */
  function ComponentOptionsListIterator(list) {
    _classCallCheck(this, ComponentOptionsListIterator);

    this._list = list;
    this.position = -1;
  }
  /**
   * The component options the iterator is currently pointed at
   * @returns {ComponentOptions} The current component options
   */


  _createClass(ComponentOptionsListIterator, [{
    key: "getComponent",
    value: function getComponent() {
      return this._list.getAtPosition(this.position);
    }
    /**
     * Move to the next component options in the list, if not already at the end of the
     * list.
     * @returns {ComponentOptionsList|null} The next component options the iterator is now
     *        pointed at. If the iterator is already at the last component options, null
     *        is returned.
     */

  }, {
    key: "next",
    value: function next() {
      if (this.position + 1 < this._list.length) {
        this.position++;
        return this.getComponent();
      } else {
        return null;
      }
    }
  }]);

  return ComponentOptionsListIterator;
}();

export default ComponentOptionsListIterator;