const express = require('express');
const mongoose = require('mongoose');
const auth = require('../../middlewares/auth');
const credentials = require('../../middlewares/credentials');

const router = express.Router();
const User = mongoose.model('User');

router.post('/login', credentials, (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user.validatePassword(req.body.password)) {
        const token = user.generateJWT();
        return res.status(200).json({ token });
      }
      return res.status(400).json({ error: { password: 'wrong password' } });
    })
    .catch((err) => {
      return res.status(400).json({ error: { user: 'not found' } });
    });
});

router.post('/add', credentials, (req, res, next) => {
  const user = {
    username: req.body.username,
    hash: req.body.password,
  }

  User.create(user)
    .then(() => res.status(200).json({ sucess: true }))
    .catch((err) => {
      return res.status(400).json({ error: { user: 'unable to create' } });
    });
});

router.get('/favorites', auth, (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      return res.status(200).json({ favorites: user.favorites });
    })
    .catch((err) => {
      return res.status(400).json({ error: { user: 'not found' } });
    });
});

module.exports = router;