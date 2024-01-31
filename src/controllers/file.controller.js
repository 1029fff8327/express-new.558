const FileService = require('../services/file.service');
const { v4: uuidv4 } = require('uuid');

class FileController {
  constructor(fileService) {
    this.fileService = fileService;
  }

  async uploadFile(req, res) {
    try {
      const { file } = req;
  
      if (!file || !file.buffer) {
        console.error('Error: No file received or invalid file');
        return res.status(400).json({ error: 'Invalid file provided' });
      }
  
      const { buffer, originalname, mimetype } = file;
  
      const formData = new FormData();
      formData.append('file', buffer, {
        filename: originalname,
        contentType: mimetype,
      });
  
      await axios.post(`${this.FILE_SERVICE_BASE_URL}/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      res.status(201).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error handling file upload:', error);
  
      if (error.response) {
        console.error('Response status code:', error.response.status);
        console.error('Response data:', error.response.data);
      }
  
      res.status(500).json({ error: 'Failed to handle file upload' });
    }
  }
  

  async update(req, res) {
    try {
      const { id } = req.params;
      const { data, meta } = req.file;
      const result = await this.fileService.update(id, data, meta);

      res.status(200).json(result);
    } catch (error) {
      console.error(`Error updating file: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { stream, meta } = await this.fileService.getById(id);

      if (!stream) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.setHeader('Content-Type', meta.mimetype);
      res.setHeader('Content-Length', meta.size);
      stream.pipe(res);
    } catch (error) {
      console.error(`Error getting file by ID: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = FileController;
