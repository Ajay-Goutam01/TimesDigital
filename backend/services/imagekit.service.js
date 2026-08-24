import imagekit from '../config/imagekit.js';
import { ApiError } from '../utils/ApiError.js';

class ImageKitService {
  /**
   * Upload a single file buffer to ImageKit
   * @param {Buffer} fileBuffer - Buffer from multer memoryStorage
   * @param {string} fileName - Original or custom file name
   * @param {string} folder - Folder path inside ImageKit (e.g., 'times-school/faculty')
   * @param {Array<string>} tags - Optional tags for indexing
   * @returns {Promise<{url: string, fileId: string, name: string, thumbnailUrl: string, folder: string}>}
   */
  static async uploadFile(fileBuffer, fileName, folder = 'times-school/general', tags = []) {
    if (!imagekit) {
      throw new ApiError(500, 'ImageKit service is not configured. Please check environment variables.');
    }

    try {
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: `${Date.now()}-${fileName.replace(/\s+/g, '_')}`,
        folder: folder.startsWith('/') ? folder : `/${folder}`,
        tags: tags,
        useUniqueFileName: true
      });

      return {
        url: response.url,
        fileId: response.fileId,
        fileName: response.name,
        thumbnailUrl: response.thumbnailUrl || response.url,
        folder: folder
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new ApiError(502, `Failed to upload image to ImageKit: ${error.message || error}`);
    }
  }

  /**
   * Upload multiple files in parallel
   * @param {Array<Express.Multer.File>} files - Multer files array
   * @param {string} folder - Target folder
   * @returns {Promise<Array<{url: string, fileId: string, fileName: string, thumbnailUrl: string, folder: string}>>}
   */
  static async uploadMultipleFiles(files, folder = 'times-school/gallery') {
    if (!files || !Array.isArray(files) || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, file.originalname, folder)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete an image from ImageKit by fileId
   * @param {string} fileId - ImageKit fileId
   * @returns {Promise<boolean>}
   */
  static async deleteFile(fileId) {
    if (!fileId) return true;
    if (!imagekit) {
      console.warn('ImageKit not configured, skipping deletion of fileId:', fileId);
      return false;
    }

    try {
      await imagekit.deleteFile(fileId);
      return true;
    } catch (error) {
      console.error(`ImageKit delete error for fileId ${fileId}:`, error);
      // We don't hard crash if file is already deleted or not found on imagekit
      return false;
    }
  }

  /**
   * Bulk delete multiple files by array of fileIds
   * @param {Array<string>} fileIds
   * @returns {Promise<boolean>}
   */
  static async bulkDeleteFiles(fileIds) {
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return true;
    }

    const validIds = fileIds.filter(Boolean);
    if (validIds.length === 0) return true;

    try {
      const deletePromises = validIds.map((id) => this.deleteFile(id));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('ImageKit bulk deletion error:', error);
      return false;
    }
  }
}

export default ImageKitService;
