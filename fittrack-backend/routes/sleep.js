const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createSleepLog,
  getSleepLogs,
  updateSleepLog,
  deleteSleepLog,
} = require('../controllers/sleepController');

router.use(authMiddleware);

router.post('/', createSleepLog);
router.get('/', getSleepLogs);
router.put('/:id', updateSleepLog);
router.delete('/:id', deleteSleepLog);

module.exports = router;