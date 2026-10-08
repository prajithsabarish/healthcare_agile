const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

const sprintRouter = require('./sprintRoutes');
const storyRouter = require('./storyRoutes');
const analyticsRouter = require('./analyticsRoutes');

router.use('/:projectId/sprints', sprintRouter);
router.use('/:projectId/stories', storyRouter);
router.use('/:projectId/analytics', analyticsRouter);

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router.route('/:id')
  .get(protect, getProjectById);

module.exports = router;
