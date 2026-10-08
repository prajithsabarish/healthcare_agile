const pool = require('../config/db');

const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(projects[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO projects (name, description, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, description, start_date, end_date, req.user.id]
    );

    res.status(201).json({ id: result.insertId, name, description, start_date, end_date, created_by: req.user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

module.exports = { getProjects, getProjectById, createProject };
