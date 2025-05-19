/**
 * Handles keyboard events and key combination matching for the Easter Egg system
 */
export interface KeyCombination {
  type: string;
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  [key: string]: any;
}

export class KeyHandler {
  activeCombinations: Map<string, KeyCombination>;
  pressedKeys: Set<string>;

  constructor() {
    this.activeCombinations = new Map();
    this.pressedKeys = new Set();
  }

  /**
   * Normalizes a key to handle different keyboard layouts and operating systems
   * @param {string} key - The key to normalize
   * @returns {string} - The normalized key
   */
  normalizeKey(key: string): string {
    // Handle special cases for different keyboard layouts
    const specialKeyMap: Record<string, string> = {
      Í: "s", í: "s", ß: "s", ś: "s", š: "s", ş: "s", ș: "s",
      á: "a", à: "a", â: "a", ä: "a", ã: "a", å: "a", ā: "a",
      é: "e", è: "e", ê: "e", ë: "e", ē: "e", ę: "e", ė: "e",
      ì: "i", î: "i", ï: "i", ī: "i", į: "i", ı: "i",
      ó: "o", ò: "o", ô: "o", ö: "o", õ: "o", ō: "o", ø: "o",
      ú: "u", ù: "u", û: "u", ü: "u", ū: "u", ų: "u", ů: "u",
      ý: "y", ÿ: "y", ŷ: "y", ȳ: "y",
      ç: "c", ć: "c", č: "c", ĉ: "c", ċ: "c",
      ñ: "n", ń: "n", ň: "n", ņ: "n", ŋ: "n",
      ź: "z", ż: "z", ž: "z", ȥ: "z",
      ł: "l", ĺ: "l", ļ: "l", ľ: "l", ŀ: "l",
      ŕ: "r", ř: "r", ŗ: "r", ȑ: "r", ȓ: "r",
      ğ: "g", ġ: "g", ģ: "g", ĝ: "g", ǧ: "g",
      ĥ: "h", ħ: "h", ḧ: "h", ḣ: "h", ḥ: "h",
      ĵ: "j", ǰ: "j",
      ķ: "k", ḱ: "k", ḳ: "k", ḵ: "k",
      ḿ: "m", ṁ: "m", ṃ: "m",
      ṕ: "p", ṗ: "p",
      ṫ: "t", ṭ: "t", ṯ: "t", ŧ: "t",
      ẁ: "w", ẃ: "w", ẅ: "w", ẇ: "w", ẉ: "w",
      ď: "d", ḋ: "d", ḍ: "d", ḏ: "d", ḑ: "d", ḓ: "d",
      ḃ: "b", ḅ: "b", ḇ: "b",
      ṽ: "v", ṿ: "v",
      ḟ: "f",
      ẋ: "x", ẍ: "x",
      ɋ: "q",
    };

    return specialKeyMap[key] || key.toLowerCase();
  }

  /**
   * Normalizes a modifier key name to handle different operating systems
   * @param {string} key - The modifier key to normalize
   * @returns {string} - The normalized modifier key
   */
  normalizeModifierKey(key: string): string {
    const modifierMap: Record<string, string> = {
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
  isKeyCombinationMatch(event: KeyboardEvent, trigger: KeyCombination): boolean {
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
  handleKeyDown(event: KeyboardEvent): void {
    this.pressedKeys.add(event.key);
  }

  /**
   * Handles a key up event
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyUp(event: KeyboardEvent): void {
    this.pressedKeys.delete(event.key);
  }

  /**
   * Resets the currently pressed keys
   */
  reset(): void {
    this.pressedKeys.clear();
  }

  /**
   * Registers a key combination for an egg
   * @param {string} id - The egg ID
   * @param {Object} combination - The key combination configuration
   */
  registerCombination(id: string, combination: KeyCombination): void {
    this.activeCombinations.set(id, combination);
  }

  /**
   * Unregisters a key combination for an egg
   * @param {string} id - The egg ID
   */
  unregisterCombination(id: string): void {
    this.activeCombinations.delete(id);
  }
}
