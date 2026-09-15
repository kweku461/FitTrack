const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getGoals, updateGoals } = require('../controllers/goalsController');

router.use(authMiddleware);

router.get('/', getGoals);
router.put('/', updateGoals);

module.exports = router;