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
const updateProfile = async (id, data) => {
    const {
        name,
        headline,
        bio,
        phone,
        location
    } = data;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1. Update tbl_users (Check if user exists)
        const [userResult] = await conn.query(
            `UPDATE tbl_users SET name = ? WHERE id = ?`,
            [name, id]
        );

        // If no user found, rollback and throw error
        if (userResult.affectedRows === 0) {
            throw new Error(`User with ID ${id} not found. Update failed.`);
        }

        // 2. Check if the seeker profile already exists
        const [seekerExists] = await conn.query(
            `SELECT id FROM tbl_seekers WHERE user_id = ?`,
            [id]
        );

        if (seekerExists.length > 0) {
            // ✅ Case 1: Profile exists → UPDATE it
            const [seekerResult] = await conn.query(
                `UPDATE tbl_seekers 
                 SET headline = ?, bio = ?, phone = ?, location = ? 
                 WHERE user_id = ?`,
                [headline, bio, phone, location, id]
            );
            
            // if (seekerResult.affectedRows === 0) console.log("No changes made to seeker profile");
            
        } else {
            // ✅ Case 2: Profile does NOT exist → INSERT it (so you don't get a "silent fail")
            await conn.query(
                `INSERT INTO tbl_seekers (user_id, headline, bio, phone, location) 
                 VALUES (?, ?, ?, ?, ?)`,
                [id, headline, bio, phone, location]
            );
        }

        // Commit transaction if everything succeeded
        await conn.commit();

        return {
            success: true,
            message: "Profile updated successfully"
        };

    } catch (error) {
        // Rollback on any error
        await conn.rollback();
        throw error; // Re-throw so the Controller can catch it
    } finally {
        conn.release();
    }
};

// Upload CV
const uploadCv = async (id, filename) => {
    const [rows] = await pool.query(
        "INSERT INTO tbl_seeker_cvs (user_id, filename) VALUES (?, ?)",
        [id, filename]
    );
    return rows;
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


// Update Skill
const updateSkill = async (skill, id) => {
    const [rows] = await pool.query(
        "UPDATE tbl_seekers_skill SET skill = ? WHERE user_id = ?",
        [skill, id]
    );
    return rows;
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
    uploadCv,
    updateSkill,
    updateExperience,
    createExperience,
    getSeekerByUserId
};