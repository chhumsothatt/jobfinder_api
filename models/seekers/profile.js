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
            sk.headline,
            sk.bio,
            sk.phone,
            sk.location,
            sk.avatar
        FROM tbl_users us
        INNER JOIN tbl_seekers sk
            ON us.id = sk.user_id
        WHERE us.id = ?`,
        [id]
    );
    return rows;
};

// Upload Avatar
const updateAvatar = async (id, avatar) => {
    const [rows] = await pool.query(
        "UPDATE tbl_seekers SET avatar = ? WHERE user_id = ?",
        [avatar, id]
    );
    return rows;
};

// Update Profile
const updateProfile = async (id, body) => {
    const { name, headline, bio, phone, location } = body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query("UPDATE tbl_users SET name = ? WHERE id = ?", [name, id]);
        await conn.query(
            `UPDATE tbl_seekers
             SET headline = ?, bio = ?, phone = ?, location = ?
             WHERE user_id = ?`,
            [headline, bio, phone, location, id]
        );
        await conn.commit();
        return true;
    } catch (err) {
        await conn.rollback();
        throw err;
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

// Update Skill
const updateSkill = async (skill, id) => {
    const [rows] = await pool.query(
        "UPDATE tbl_seekers_skill SET skill = ? WHERE user_id = ?",
        [skill, id]
    );
    return rows;
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
};