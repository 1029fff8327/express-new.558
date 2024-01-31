const path = require('path');
const fs = require('fs/promises');
const sizeOf = require('image-size');
const { v4: uuidv4 } = require('uuid');
const { getDirectorySize, writeFileAsync } = require('./../lib/utils');
const { logFileOperation } = require('./../lib/logger');

class FileService {
  constructor(fileAdapter, fileModel) {
    this.fileAdapter = fileAdapter;
    this.model = fileModel;
  }

  async checkImage(file) {
    try {
      console.log('File content:', file);
      const uint8Array = new Uint8Array(file);
      const dimensions = sizeOf(uint8Array);
      if (dimensions.type !== 'image') {
        throw new Error('The file is not an image.');
      }
      return true;
    } catch (error) {
      console.error('Error checking image:', error.message);
      throw error;
    }
  }

  async create(postData) {
    try {
      const { file, meta } = postData;
      await this.checkImage(file);

      const postId = meta.fileId || uuidv4(); 
      const postDir = path.join(__dirname, '../data', postId);

      await writeFileAsync(path.join(postDir, 'post.json'), JSON.stringify(meta));

      logFileOperation('Create', postId, await this.getDirectorySize());

      return { postId, xApiKey: 'x-api-key', otherInfo: 'дополнительная информация' };
    } catch (err) {
      console.error(`Error creating file: ${err.message}`);
      throw err;
    }
  }

  async update(id, file, meta) {
    try {
      logFileOperation('Update', id, await this.getDirectorySize());

      const updatedFile = await this.model.findByIdAndUpdate(id, {
        $set: { size: meta.size, mimetype: meta.mimetype },
      }, { new: true });

      if (!updatedFile) {
        throw new Error('File not found');
      }

      const updateResult = await this.fileAdapter.update(id, file, meta);

      if (updateResult) {
        return updateResult;
      } else {
        throw new Error('File update failed in FileAdapter');
      }
    } catch (err) {
      console.error(`Error updating file in FileService: ${err.message}`);
      throw err;
    }
  }

  async getById(id) {
    try {
      const { stream, meta } = await this.fileAdapter.getById(id);
      logFileOperation('Retrieve', id, await this.getDirectorySize());
      return { stream, meta };
    } catch (err) {
      console.error(`Error getting file by ID ${id} in FileService: ${err.message}`);
      throw err;
    }
  }

  async getDirectorySize() {
    try {
      const directoryPath = path.join(__dirname, '../data');
      return await getDirectorySize(directoryPath);
    } catch (err) {
      console.error(`Error getting directory size in FileService: ${err.message}`);
      throw err;
    }
  }

  async saveFile(fileId, fileBuffer) {
    try {
      const filePath = path.join(__dirname, '../uploads', fileId + '.jpg'); 
      await fs.writeFile(filePath, fileBuffer);
    } catch (error) {
      console.error(`Error saving file: ${error.message}`);
      throw error;
    }
  }
}

module.exports = FileService;
