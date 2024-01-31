const { Schema, model } = require('mongoose');

const fileSchema = new Schema({
  name: String,
  size: Number,
  mimetype: String,
  createDate: Date
});

module.exports = model('files', fileSchema);
