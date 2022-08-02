const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/score');

router.put('/', scoreController.handleScore);

module.exports = router;