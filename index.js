const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./src/config/swagger-config');
const dotenv = require('dotenv');
const mongoConfig = require('./src/config/mongo-config');
const fileRoutes = require('./src/routes/file.routes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoConfig.connect(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(express.json({ limit: '5mb' }));
app.use(fileRoutes); 

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
