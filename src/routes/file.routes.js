const { Router } = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const FileModel = require('../models/file.model');
const FileAdapter = require('../lib/file.adapter');
const FileService = require('../services/file.service');
const FileController = require('../controllers/file.controller');
const fileMiddleware = require('../middlewares/file.middlewares');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('../config/swagger-config');

const fileRouter = Router();
const controller = new FileController(
  new FileService(
    new FileAdapter(),
    FileModel
  )
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `uploads/${uuidv4()}`;
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const fileId = uuidv4();
    const originalname = file.originalname;
    const extension = originalname.slice(originalname.lastIndexOf('.'));
    const sanitizedOriginalname = originalname.replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, fileId + '-' + sanitizedOriginalname);
  }
});

const upload = multer({ storage: storage });

fileRouter.post('/:name', fileMiddleware, (req, res) => controller.create(req, res));
fileRouter.put('/file/:id', fileMiddleware, (req, res) => controller.update(req, res));
fileRouter.get('/file/:id', fileMiddleware, (req, res) => controller.getById(req, res));

fileRouter.post('/file/upload', upload.single('file'), async (req, res) => {
  try {
    await controller.uploadFile(req, res);
  } catch (error) {
    console.error('Error handling file upload:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

fileRouter.use('/docs', swaggerUi.serve);
fileRouter.get('/docs', swaggerUi.setup(swaggerConfig));

module.exports = fileRouter;
