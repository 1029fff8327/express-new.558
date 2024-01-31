const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const logger = require('./logger');
const { getDirectorySize, writeFileAsync } = require('./utils');

const createReadStreamAsync = promisify(fs.createReadStream);

class FileAdapter {
  constructor() {
    this.dir = (id) => path.join(__dirname, '../data', `${id}`);
  }

  async create(id, data, meta) {
    const directoryPath = path.join(__dirname, '../data');
    const filePath = this.dir(id);

    try {
      await writeFileAsync(filePath, data);
      const size = await getDirectorySize(directoryPath);
      logger.logFileOperation('Create', id, size + meta.size);
      return true;
    } catch (err) {
      logger.logger.error(`Error creating file (ID: ${id}): ${err.message}`);
      throw err;
    }
  }

  async update(id, data, meta) {
    const directoryPath = path.join(__dirname, '../data');
    const filePath = this.dir(id);

    try {
      await writeFileAsync(filePath, data);
      const size = await getDirectorySize(directoryPath);
      logger.logFileOperation('Update', id, size);
      return true;
    } catch (err) {
      logger.logger.error(`Error updating file (ID: ${id}): ${err.message}`);
      throw err;
    }
  }

  async getById(id) {
    try {
      const filePath = this.dir(id);
      const fileStats = await fs.promises.stat(filePath);

      if (!fileStats.isFile()) {
        return { stream: null, meta: null };
      }

      const stream = createReadStreamAsync(filePath, { highWaterMark: 16 * 1024 });
      const fileMeta = {
        mimetype: 'application/octet-stream',
        size: fileStats.size,
      };

      return { stream, meta: fileMeta };
    } catch (err) {
      logger.logger.error(`Error getting file by ID (FileAdapter): ${err.message}`);
      throw err;
    }
  }
}

module.exports = FileAdapter;
