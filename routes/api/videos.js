const express = require('express');
const mongoose = require('mongoose');
const getService = require('../../helpers/serviceHelper');

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
  if (!req.body.url) {
    return res.status(400).json({ error: { url: 'not provided' } });
  }

  const url = req.body.url;
  const service = getService(url);

  const isId = url.indexOf('http') !== -1 || url.indexOf('www') !== -1;
  const id = isId ? url : service.getId(url, service);
  console.log('id', id);
  service.fetch(id)
    .then(async (video) => {
      await Video.create(video);
      console.log(video);
      res.status(200).json({ success: true, video });
    })
    .catch((err) => {
      res.status(500).json({ error: { message: 'Not found' } });
    })
});

router.delete('/', (req, res, next) => {
  Video.remove({})
    .then(() => {
      res.status(200).json({ sucess: true, message: 'sucessfully removed all videos.' });
    })
    .catch((err) => {
      res.status(500).json({ error: { message: 'something went wrong.' } })
    });
});

router.delete('/:id', (req, res, next) => {
  Video.remove({ id: req.params.id })
    .then(() => {
      res.status(200).json({ sucess: true, message: 'sucessfully removed video.' });
    })
    .catch((err) => {
      res.status(500).json({ error: { message: 'something went wrong.' } })
    });
})

module.exports = router;