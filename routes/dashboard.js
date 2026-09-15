const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getWeeklySummary } = require('../controllers/dashboardController');

router.use(authMiddleware);
router.get('/weekly', getWeeklySummary);

module.exports = router;