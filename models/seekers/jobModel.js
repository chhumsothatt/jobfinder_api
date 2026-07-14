const pool = require('../../configs/db');


const getAlljob = async () => {
    const query = `
        SELECT 
            j.*,
            c.name AS category_name,
            comp.id AS company_id,
            comp.location AS company_location
        FROM tbl_jobs j
        LEFT JOIN tbl_categories c ON j.category_id = c.id
        LEFT JOIN tbl_companies comp ON j.company_id = comp.id
        WHERE j.status = 'active'
        ORDER BY j.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;

};

const getJobDetail = async (jobId) => {
    const query = `
        SELECT 
            j.*,
            c.name AS category_name,
            comp.id AS company_id,
            comp.location AS company_location
        FROM tbl_jobs j
        LEFT JOIN tbl_categories c ON j.category_id = c.id
        LEFT JOIN tbl_companies comp ON j.company_id = comp.id
        WHERE j.id = ?
    `;
    const [rows] = await pool.query(query, [jobId]);
    return rows.length ? rows[0] : null;
};

const searchJobByCategory = async (categoryName) => {
    const query = `
        SELECT 
            j.*,
            c.name AS category_name,
            comp.id AS company_id,
            comp.location AS company_location
        FROM tbl_jobs j
        JOIN tbl_categories c ON j.category_id = c.id
        LEFT JOIN tbl_companies comp ON j.company_id = comp.id
        WHERE LOWER(c.name) LIKE LOWER(?)
          AND j.status = 'active'
        ORDER BY j.created_at DESC
    `;
    const [rows] = await pool.query(query, [`%${categoryName}%`]);
    return rows;
};

module.exports = {
    getAlljob,
    getJobDetail,
    searchJobByCategory
};