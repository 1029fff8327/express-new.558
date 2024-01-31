require('dotenv').config();
const mongoose = require('mongoose');

class MongoConfig {
  constructor() {
    this.host = process.env.MONGO_HOST || 'localhost';
    this.port = process.env.MONGO_PORT || 27017;
  }

  connect() {
    const uri = `mongodb://${this.host}:${this.port}`;

    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });
  }
}

module.exports = new MongoConfig(); 
