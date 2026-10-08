const express = require('express');
const router = express.Router({ mergeParams: true });
const { getSprintsByProject, createSprint } = require('../controllers/sprintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getSprintsByProject)
  .post(protect, authorize('Scrum Master'), createSprint);

module.exports = router;
