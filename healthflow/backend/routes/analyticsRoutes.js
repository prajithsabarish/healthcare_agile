const express = require('express');
const router = express.Router({ mergeParams: true });
const { getVelocity, getBurndown } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/velocity', protect, getVelocity);
router.get('/sprints/:sprintId/burndown', protect, getBurndown);

module.exports = router;
