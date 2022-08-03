const express = require('express');
const router = express.Router();
const rankingsController = require('../controllers/rankings');

router.get('/', rankingsController.handleRankings);

module.exports = router;