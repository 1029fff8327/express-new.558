const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./src/config/swagger-config');
const dotenv = require('dotenv');
const fileRoutes = require('./src/routes/file.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb://localhost:27017/program'; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB from Express');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(express.json({ limit: '5mb' }));
app.use(fileRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
