/**
 * Generate a clean URL-friendly slug from a string
 * @param {string} text
 * @returns {string}
 */
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars except space and hyphen
    .replace(/[\s_-]+/g, '-') // swap spaces and underscores for single -
    .replace(/^-+|-+$/g, ''); // remove leading and trailing dashes
};
