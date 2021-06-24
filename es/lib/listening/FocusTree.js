function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FocusTree = /*#__PURE__*/function () {
  function FocusTree() {
    _classCallCheck(this, FocusTree);

    this.id = 0;
  }

  _createClass(FocusTree, [{
    key: "isNewerThan",
    value: function isNewerThan(id) {
      return this.id !== id;
    }
  }, {
    key: "new",
    value: function _new() {
      this.id += 1;
    }
  }]);

  return FocusTree;
}();

export default FocusTree;