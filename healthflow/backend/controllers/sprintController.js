const pool = require('../config/db');

const getSprintsByProject = async (req, res) => {
  try {
    const [sprints] = await pool.query('SELECT * FROM sprints WHERE project_id = ?', [req.params.projectId]);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sprints' });
  }
};

const createSprint = async (req, res) => {
  try {
    const { name, goal, start_date, end_date } = req.body;
    const projectId = req.params.projectId;

    const [result] = await pool.query(
      'INSERT INTO sprints (project_id, name, goal, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [projectId, name, goal, start_date, end_date]
    );

    res.status(201).json({ id: result.insertId, project_id: projectId, name, goal, start_date, end_date });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sprint' });
  }
};

module.exports = { getSprintsByProject, createSprint };
