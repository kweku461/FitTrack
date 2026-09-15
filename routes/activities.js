const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createActivity, getActivities, deleteActivity } = require('../controllers/activityController');

router.use(authMiddleware);

router.post('/', createActivity);
router.get('/', getActivities);
router.delete('/:id', deleteActivity);

module.exports = router;