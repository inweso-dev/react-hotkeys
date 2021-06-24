/**
 * Dictionary of keys whose name is not a single symbol or character
 */
import dictionaryFrom from '../utils/object/dictionaryFrom';
import translateToKey from '../vendor/react-dom/translateToKey';
import objectValues from '../utils/object/values';
var NonPrintableKeysDictionary = dictionaryFrom(objectValues(translateToKey));
export default NonPrintableKeysDictionary;