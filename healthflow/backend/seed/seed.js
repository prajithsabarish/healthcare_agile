const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('Seeding data...');

        // Clear existing data (in a real app, handle with care)
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE retrospective_items');
        await pool.query('TRUNCATE TABLE retrospectives');
        await pool.query('TRUNCATE TABLE sprint_reviews');
        await pool.query('TRUNCATE TABLE daily_scrum');
        await pool.query('TRUNCATE TABLE sprint_stories');
        await pool.query('TRUNCATE TABLE user_stories');
        await pool.query('TRUNCATE TABLE sprints');
        await pool.query('TRUNCATE TABLE project_members');
        await pool.query('TRUNCATE TABLE projects');
        await pool.query('TRUNCATE TABLE users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('password123', salt);
        const smPassword = await bcrypt.hash('password123', salt);
        const devPassword = await bcrypt.hash('password123', salt);

        const [adminResult] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@healthflow.com', ?, 'Admin')",
            [adminPassword]
        );
        const adminId = adminResult.insertId;

        const [smResult] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ('Scrum Master 1', 'scrummaster@healthflow.com', ?, 'Scrum Master')",
            [smPassword]
        );
        const smId = smResult.insertId;

        const [devResult] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ('Developer 1', 'developer@healthflow.com', ?, 'Team Member')",
            [devPassword]
        );
        const devId = devResult.insertId;

        // Create Projects
        const [projResult] = await pool.query(
            "INSERT INTO projects (name, description, status, start_date, end_date, created_by) VALUES ('Patient Appointment System', 'Online appointment booking and scheduling system.', 'Active', '2026-09-01', '2026-12-31', ?)",
            [adminId]
        );
        const projectId = projResult.insertId;

        // Create Sprints
        const [sprint1Result] = await pool.query(
            "INSERT INTO sprints (project_id, name, goal, start_date, end_date, status) VALUES (?, 'Sprint 1', 'Develop the basic patient appointment management functionality.', '2026-09-01', '2026-09-14', 'Completed')",
            [projectId]
        );
        const sprint1Id = sprint1Result.insertId;

        const [sprint2Result] = await pool.query(
            "INSERT INTO sprints (project_id, name, goal, start_date, end_date, status) VALUES (?, 'Sprint 2', 'Implement the core appointment booking workflow.', '2026-09-15', '2026-09-28', 'Active')",
            [projectId]
        );
        const sprint2Id = sprint2Result.insertId;

        // Create Stories
        await pool.query(
            "INSERT INTO user_stories (project_id, title, description, acceptance_criteria, priority, story_points, status, assignee_id, sprint_id) VALUES (?, 'US-001 As a patient, I want to register online', '...', '...', 'High', 5, 'Done', ?, ?)",
            [projectId, devId, sprint1Id]
        );

        await pool.query(
            "INSERT INTO user_stories (project_id, title, description, acceptance_criteria, priority, story_points, status, assignee_id, sprint_id) VALUES (?, 'US-002 As a patient, I want to search for available doctors', '...', '...', 'High', 5, 'Testing', ?, ?)",
            [projectId, devId, sprint2Id]
        );

        await pool.query(
            "INSERT INTO user_stories (project_id, title, description, acceptance_criteria, priority, story_points, status, assignee_id, sprint_id) VALUES (?, 'US-003 As a patient, I want to book an appointment', '...', '...', 'Critical', 8, 'In Progress', ?, ?)",
            [projectId, devId, sprint2Id]
        );

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
