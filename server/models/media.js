const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: String,
  title: String,
  data: Buffer,
  contentType: String,
  premium: Boolean,
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
