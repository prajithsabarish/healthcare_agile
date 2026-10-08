const pool = require('../config/db');

const getStoriesByProject = async (req, res) => {
  try {
    const [stories] = await pool.query('SELECT * FROM user_stories WHERE project_id = ?', [req.params.projectId]);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories' });
  }
};

const createStory = async (req, res) => {
  try {
    const { title, description, acceptance_criteria, priority, story_points } = req.body;
    const projectId = req.params.projectId;

    const [result] = await pool.query(
      'INSERT INTO user_stories (project_id, title, description, acceptance_criteria, priority, story_points) VALUES (?, ?, ?, ?, ?, ?)',
      [projectId, title, description, acceptance_criteria, priority, story_points]
    );

    res.status(201).json({
      id: result.insertId,
      project_id: projectId,
      title,
      description,
      acceptance_criteria,
      priority,
      story_points,
      status: 'To Do'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating story' });
  }
};

const updateStoryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const storyId = req.params.id;

        await pool.query('UPDATE user_stories SET status = ? WHERE id = ?', [status, storyId]);
        res.json({ message: 'Story status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating story status' });
    }
};

module.exports = { getStoriesByProject, createStory, updateStoryStatus };
