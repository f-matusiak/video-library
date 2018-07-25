const express = require('express');

const router = express.Router();

router.use('/videos', require('./videos'));

module.exports = router;