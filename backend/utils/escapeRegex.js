/**
 * Escapes special regular expression characters in a string
 * Prevents ReDoS attacks and regex syntax errors when constructing new RegExp from user input
 * @param {string} text - Input text from user
 * @returns {string} - Escaped text safe for RegExp constructor
 */
export const escapeRegex = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
