const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createWaterLog,
  getWaterLogs,
  updateWaterLog,
  deleteWaterLog,
} = require('../controllers/waterController');

router.use(authMiddleware);

router.post('/', createWaterLog);
router.get('/', getWaterLogs);
router.put('/:id', updateWaterLog);
router.delete('/:id', deleteWaterLog);

module.exports = router;