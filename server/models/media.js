const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  length: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  premium: { type: Boolean, default: false },
  category: {type: 'String', default: 'general'},
  isAnasayfa: { type: Boolean, default: false }
});

module.exports = mongoose.model('Media', mediaSchema);