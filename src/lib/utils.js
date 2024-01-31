const path = require('path');
const fs = require('fs').promises;

function getDirectory() {
  return path.join(__dirname, '../data');
}

async function getDirectorySize(directory = getDirectory()) {
  try {
    const exists = await fs.access(directory, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      console.error(`Directory not found: ${directory}`);
      return 0;
    }

    const files = await fs.readdir(directory);
    let directorySize = 0;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isDirectory()) {
        directorySize += await getDirectorySize(filePath);
      } else {
        directorySize += fileStats.size;
      }
    }

    return directorySize;
  } catch (error) {
    console.error('Error calculating directory size:', error);
    throw error;
  }
}

async function writeFileAsync(filePath, data) {
  try {
    await fs.writeFile(filePath, data);
  } catch (err) {
    console.error(`Error writing file: ${err.message}`);
    throw err;
  }
}

module.exports = {
  getDirectory,
  getDirectorySize,
  writeFileAsync,
};
