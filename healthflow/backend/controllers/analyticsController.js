const pool = require('../config/db');

const getVelocity = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    // Get completed sprints and sum of story points for 'Done' stories
    const query = `
      SELECT s.id, s.name, s.end_date, COALESCE(SUM(us.story_points), 0) as points
      FROM sprints s
      LEFT JOIN user_stories us ON s.id = us.sprint_id AND us.status = 'Done'
      WHERE s.project_id = ? AND s.status = 'Completed'
      GROUP BY s.id
      ORDER BY s.end_date ASC
      LIMIT 10
    `;
    const [results] = await pool.query(query, [projectId]);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching velocity data' });
  }
};

const getBurndown = async (req, res) => {
    try {
        const sprintId = req.params.sprintId;
        // In a real burndown, we would track daily remaining points.
        // For demonstration, we will return a structured mock array based on total sprint points.
        const [stories] = await pool.query('SELECT story_points, status FROM user_stories WHERE sprint_id = ?', [sprintId]);
        
        let totalPoints = 0;
        let completedPoints = 0;
        
        stories.forEach(story => {
            totalPoints += story.story_points;
            if (story.status === 'Done') {
                completedPoints += story.story_points;
            }
        });

        // Generate synthetic burndown data for 14 days
        const data = [];
        const duration = 14;
        let currentActual = totalPoints;
        const actualDropPerDay = completedPoints / (duration / 2); // Simulating progress

        for (let i = 0; i <= duration; i++) {
            let ideal = totalPoints - ((totalPoints / duration) * i);
            
            // Just a simple mock simulation for actual line based on real DB totals
            let actual = null;
            if (i <= duration / 2) {
                actual = currentActual - (actualDropPerDay * i);
            }

            data.push({
                day: `Day ${i}`,
                ideal: Math.max(0, Math.round(ideal)),
                actual: actual !== null ? Math.max(0, Math.round(actual)) : null
            });
        }
        
        res.json({ totalPoints, completedPoints, chartData: data });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching burndown data' });
    }
};

module.exports = { getVelocity, getBurndown };
