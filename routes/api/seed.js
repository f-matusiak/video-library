const express = require('express');
const mongoose = require('mongoose');
const faker = require('faker');

const router = express.Router();
const Video = mongoose.model('Video');

router.post('/', (req, res, next) => {
  const promises = [];
  for (let x = 0; x < 25; x += 1) {
    const video = {
      title: faker.company.companyName(),
      views: faker.random.number(),
      likes: faker.random.number(),
      thumbnailUrl: faker.image.imageUrl(),
      createdAt: faker.date.recent(),
    };

    promises.push(Video.create(video));
  }

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ success: true, message: 'created 25 fake videos' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        success: false, error:
          { message: 'something went wrong' },
      });
    });
});

module.exports = router;