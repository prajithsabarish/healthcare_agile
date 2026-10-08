const express = require('express');
const router = express.Router({ mergeParams: true });
const { getStoriesByProject, createStory, updateStoryStatus } = require('../controllers/storyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getStoriesByProject)
  .post(protect, authorize('Scrum Master'), createStory);

router.route('/:id/status')
  .put(protect, updateStoryStatus);

module.exports = router;
