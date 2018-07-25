const express = require('express');
const mongoose = require('mongoose');

const Video = mongoose.model('Video');
const router = express.Router();

router.get('/', (req, res, next) => {
  let limit = 100;
  let offset = 0;
  if (req.body.limit) {
    limit = req.body.limit;
  }
  if (req.body.offset) {
    offset = req.body.offset;
  }

  Video.find().skip(offset).limit(limit)
    .then((videos) => {
      res.status(200).json(videos);
    })
    .catch((err) => {
      res.status(500).json({ error: { message: 'Database error' } });
    });
});

router.post('/add', (req, res, next) => {
  // get movie details and detect which movie handler should be used, else send error: service not supported

  res.status(200).send('you added new video!');
});

module.exports = router;