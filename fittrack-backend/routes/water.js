const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createWaterLog, getWaterLogs, deleteWaterLog } = require('../controllers/waterController');

router.use(authMiddleware);

router.post('/', createWaterLog);
router.get('/', getWaterLogs);
router.delete('/:id', deleteWaterLog);

module.exports = router;