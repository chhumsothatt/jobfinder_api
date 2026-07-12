const pool = require('../../configs/db');

// Get Profile
const getProfile = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            us.id,
            us.name,
            us.email,
            us.is_active,
            us.created_at,
            us.updated_at,
            us.avatar,
            sk.headline,
            sk.bio,
            sk.phone,
            sk.location
        FROM tbl_users us
        LEFT JOIN tbl_seekers sk
            ON us.id = sk.user_id
        WHERE us.id = ?`,
        [id]
    );
    return rows;
};

// Update avatar filename in tbl_users table
const updateAvatar = async (id, avatarFileName) => {
    const [rows] = await pool.query(
        "UPDATE tbl_users SET avatar = ? WHERE Id = ?",
        [avatarFileName, id]
    );
    return rows;
};


// Update Profile
const updateProfile = async (userId, data) => {
    const { name, headline, bio, phone, location, skill, cv } = data;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [userResult] = await conn.query(
            `UPDATE tbl_users SET name = ? WHERE id = ?`,
            [name, userId]
        );
        if (userResult.affectedRows === 0) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        const [seekerExists] = await conn.query(
            `SELECT id FROM tbl_seekers WHERE user_id = ?`,
            [userId]
        );

        if (seekerExists.length > 0) {
            await conn.query(
                `UPDATE tbl_seekers 
                 SET headline = ?, bio = ?, phone = ?, location = ?, 
                     skill = ?, cv = ?
                 WHERE user_id = ?`,
                [headline, bio, phone, location, skill, cv, userId]
            );
        } else {
            await conn.query(
                `INSERT INTO tbl_seekers 
                 (user_id, headline, bio, phone, location, skill, cv) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, headline, bio, phone, location, skill, cv]
            );
        }

        await conn.commit();
        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
};

// Create experience

const createExperience = async (seekerId, data) => {
    const { company_name, position, start_date, end_date, description } = data;
    try {
        const [result] = await pool.query(
            `INSERT INTO tbl_seeker_experiences 
             (seeker_id, company_name, position, start_date, end_date, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [seekerId, company_name, position, start_date, end_date, description]
        );
        console.log('Insert result:', result); // មើលលទ្ធផល
        return result;
    } catch (error) {
        console.error('SQL Error:', error); // បង្ហាញកំហុស SQL
        throw error; // បោះបន្តទៅ Service
    }
};


// In models/profileModel.js
const getSeekerByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT id FROM tbl_seekers WHERE user_id = ?', [userId]);
    return rows.length ? rows[0] : null;
};

// Update Experience
const updateExperience = async (
    company_name,
    position,
    start_date,
    end_date,
    description,
    id
) => {
    const [rows] = await pool.query(
        `UPDATE tbl_seeker_experience
         SET company_name = ?,
             position = ?,
             start_date = ?,
             end_date = ?,
             description = ?
         WHERE id = ?`,
        [company_name, position, start_date, end_date, description, id]
    );
    return rows;
};

module.exports = {
    getProfile,
    updateAvatar,
    updateProfile,
    updateExperience,
    createExperience,
    getSeekerByUserId
};