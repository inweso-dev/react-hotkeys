/**
 * @typedef {number} KeyEventType index (0-2) of which position in an event record
 * a particular event is located
 */

/**
 * Enum for types of key events
 * @readonly
 * @enum {KeyEventType}
 */
var KeyEventType = {
  keydown: 0,
  keypress: 1,
  keyup: 2
};
export default KeyEventType;