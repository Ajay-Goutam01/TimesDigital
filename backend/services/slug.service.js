import { generateSlug } from '../utils/generateSlug.js';

/**
 * Creates a unique slug for a given Mongoose Model
 * @param {import('mongoose').Model} Model - The Mongoose model to check uniqueness against
 * @param {string} sourceText - Text to generate slug from
 * @param {string|null} [currentId=null] - Document ID to exclude (during updates)
 * @param {string} [slugField='slug'] - The name of the slug field in the schema
 * @returns {Promise<string>}
 */
export const createUniqueSlug = async (Model, sourceText, currentId = null, slugField = 'slug') => {
  const baseSlug = generateSlug(sourceText) || 'item';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { [slugField]: slug };
    if (currentId) {
      query._id = { $ne: currentId };
    }

    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
