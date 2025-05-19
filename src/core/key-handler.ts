/**
 * Handles keyboard events and key combination matching for the Easter Egg system
 */
export class KeyHandler {
  constructor() {
    this.activeCombinations = new Map();
    this.pressedKeys = new Set();
  }

  /**
   * Normalizes a key to handle different keyboard layouts and operating systems
   * @param {string} key - The key to normalize
   * @returns {string} - The normalized key
   */
  normalizeKey(key) {
    // Handle special cases for different keyboard layouts
    const specialKeyMap = {
      // Latin characters that might map to 's'
      Í: "s",
      í: "s",
      ß: "s",
      ś: "s",
      š: "s",
      ş: "s",
      ș: "s",
      // Latin characters that might map to 'a'
      á: "a",
      à: "a",
      â: "a",
      ä: "a",
      ã: "a",
      å: "a",
      ā: "a",
      // Latin characters that might map to 'e'
      é: "e",
      è: "e",
      ê: "e",
      ë: "e",
      ē: "e",
      ę: "e",
      ė: "e",
      // Latin characters that might map to 'i'
      í: "i",
      ì: "i",
      î: "i",
      ï: "i",
      ī: "i",
      į: "i",
      ı: "i",
      // Latin characters that might map to 'o'
      ó: "o",
      ò: "o",
      ô: "o",
      ö: "o",
      õ: "o",
      ō: "o",
      ø: "o",
      // Latin characters that might map to 'u'
      ú: "u",
      ù: "u",
      û: "u",
      ü: "u",
      ū: "u",
      ų: "u",
      ů: "u",
      // Latin characters that might map to 'y'
      ý: "y",
      ÿ: "y",
      ŷ: "y",
      ȳ: "y",
      // Latin characters that might map to 'c'
      ç: "c",
      ć: "c",
      č: "c",
      ĉ: "c",
      ċ: "c",
      // Latin characters that might map to 'n'
      ñ: "n",
      ń: "n",
      ň: "n",
      ņ: "n",
      ŋ: "n",
      // Latin characters that might map to 'z'
      ź: "z",
      ż: "z",
      ž: "z",
      ȥ: "z",
      // Latin characters that might map to 'l'
      ł: "l",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      // Latin characters that might map to 'r'
      ŕ: "r",
      ř: "r",
      ŗ: "r",
      ȑ: "r",
      ȓ: "r",
      // Latin characters that might map to 'g'
      ğ: "g",
      ġ: "g",
      ģ: "g",
      ĝ: "g",
      ǧ: "g",
      // Latin characters that might map to 'h'
      ĥ: "h",
      ħ: "h",
      ḧ: "h",
      ḣ: "h",
      ḥ: "h",
      // Latin characters that might map to 'j'
      ĵ: "j",
      ǰ: "j",
      ǧ: "j",
      // Latin characters that might map to 'k'
      ķ: "k",
      ḱ: "k",
      ḳ: "k",
      ḵ: "k",
      // Latin characters that might map to 'm'
      ḿ: "m",
      ṁ: "m",
      ṃ: "m",
      // Latin characters that might map to 'p'
      ṕ: "p",
      ṗ: "p",
      // Latin characters that might map to 't'
      ṫ: "t",
      ṭ: "t",
      ṯ: "t",
      ŧ: "t",
      // Latin characters that might map to 'w'
      ẁ: "w",
      ẃ: "w",
      ẅ: "w",
      ẇ: "w",
      ẉ: "w",
      // Latin characters that might map to 'd'
      ď: "d",
      ḋ: "d",
      ḍ: "d",
      ḏ: "d",
      ḑ: "d",
      ḓ: "d",
      // Latin characters that might map to 'b'
      ḃ: "b",
      ḅ: "b",
      ḇ: "b",
      // Latin characters that might map to 'v'
      ṽ: "v",
      ṿ: "v",
      // Latin characters that might map to 'f'
      ḟ: "f",
      // Latin characters that might map to 'x'
      ẋ: "x",
      ẍ: "x",
      // Latin characters that might map to 'q'
      ɋ: "q",
    };

    return specialKeyMap[key] || key.toLowerCase();
  }

  /**
   * Normalizes a modifier key name to handle different operating systems
   * @param {string} key - The modifier key to normalize
   * @returns {string} - The normalized modifier key
   */
  normalizeModifierKey(key) {
    const modifierMap = {
      Alt: "Option",
      Option: "Alt",
      Meta: "Command",
      Command: "Meta",
    };
    return modifierMap[key] || key;
  }

  /**
   * Checks if a key combination matches the current event
   * @param {KeyboardEvent} event - The keyboard event
   * @param {Object} trigger - The trigger configuration
   * @returns {boolean} - Whether the combination matches
   */
  isKeyCombinationMatch(event, trigger) {
    if (!trigger || trigger.type !== "keyboard") return false;

    // Check if the pressed key matches
    if (event.key.toLowerCase() !== trigger.key.toLowerCase()) return false;

    // Check modifier keys
    if (trigger.ctrlKey && !event.ctrlKey) return false;
    if (trigger.shiftKey && !event.shiftKey) return false;
    if (trigger.altKey && !event.altKey) return false;
    if (trigger.metaKey && !event.metaKey) return false;

    return true;
  }

  /**
   * Handles a key down event
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown(event) {
    this.pressedKeys.add(event.key);
  }

  /**
   * Handles a key up event
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyUp(event) {
    this.pressedKeys.delete(event.key);
  }

  /**
   * Resets the currently pressed keys
   */
  reset() {
    this.pressedKeys.clear();
  }

  /**
   * Registers a key combination for an egg
   * @param {string} id - The egg ID
   * @param {Object} combination - The key combination configuration
   */
  registerCombination(id, combination) {
    this.activeCombinations.set(id, combination);
  }

  /**
   * Unregisters a key combination for an egg
   * @param {string} id - The egg ID
   */
  unregisterCombination(id) {
    this.activeCombinations.delete(id);
  }
}
