const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  likes: Number,
  thumbnailUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);