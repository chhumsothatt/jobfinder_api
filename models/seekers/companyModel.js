const pool = require('../../configs/db');

const getAllCompany = async () => {
    const query = `
        SELECT 
            c.*,
            u.name AS user_name,
            u.email AS user_email,
            u.avatar AS user_avatar
        FROM tbl_companies c
        LEFT JOIN tbl_users u ON c.user_id = u.id
        WHERE u.is_active = '1'
        ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
};

const getCompanyDetail = async (companyId) => {
    const query = `
        SELECT 
            c.*,
            u.name AS user_name,
            u.email AS user_email,
            u.avatar AS user_avatar
        FROM tbl_companies c
        LEFT JOIN tbl_users u ON c.user_id = u.id
        WHERE c.id = ?
    `;
    const [rows] = await pool.query(query, [companyId]);
    return rows.length ? rows[0] : null;
};

const searchCompanies = async (keyword) => {
    const query = `
        SELECT 
            c.*,
            u.name AS user_name,
            u.email AS user_email,
            u.avatar AS user_avatar
        FROM tbl_companies c
        LEFT JOIN tbl_users u ON c.user_id = u.id
        WHERE LOWER(c.industry) LIKE LOWER(?)
           OR LOWER(c.location) LIKE LOWER(?)
           OR LOWER(c.description) LIKE LOWER(?)
        ORDER BY c.created_at DESC
    `;
    const like = `%${keyword}%`;
    const [rows] = await pool.query(query, [like, like, like]);
    return rows;
};


const createCompany = async (companyData) => {
    const { user_id, industry, logo, description, location } = companyData;
    const query = `
        INSERT INTO tbl_companies (user_id, industry, logo, description, location)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [user_id, industry, logo, description, location]);
    return result;
};


const updateCompany = async (companyId, updateData) => {
    const { industry, logo, description, location } = updateData;
    const query = `
        UPDATE tbl_companies 
        SET industry = ?, logo = ?, description = ?, location = ?
        WHERE id = ?
    `;
    const [result] = await pool.query(query, [industry, logo, description, location, companyId]);
    return result;
};


const deleteCompany = async (companyId) => {
    const query = `DELETE FROM tbl_companies WHERE id = ?`;
    const [result] = await pool.query(query, [companyId]);
    return result;
};

module.exports = {
    getAllCompany,
    getCompanyDetail,
    searchCompanies,
    createCompany,
    updateCompany,
    deleteCompany
};