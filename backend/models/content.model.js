const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['photo', 'video'], required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  isPremium: { type: Boolean, default: true },
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;