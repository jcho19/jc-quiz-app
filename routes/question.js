const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question');

router.get('/', questionController.handleQuestion);

module.exports = router;