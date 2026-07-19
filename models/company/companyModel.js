const pool = require('../../configs/db');

class CompanyModel {
    // ----- Profile -----
    async getCompanyByUserId(userId) {
        const sql = `
        SELECT 
            u.id AS user_id, u.name, u.role, u.avatar,
            c.id AS company_id, c.industry, c.description, c.location
        FROM tbl_users u
        LEFT JOIN tbl_companies c ON u.id = c.user_id
        WHERE u.id = ?
    `;
        const [rows] = await pool.query(sql, [userId]);
        return rows[0];
    }

    async updateCompanyProfile(userId, data) {
        const { name, avatar, industry, description, location } = data;

        // 1. Update user table (name, avatar)
        const userUpdates = [];
        const userValues = [];

        // ឆែកមើលថាបើមានតម្លៃផ្ញើមកពិតប្រាកដ និងមិនមែនជា string ពាក្យថា "undefined"
        if (name !== undefined && name !== null && name !== "" && name !== "undefined") {
            userUpdates.push('name = ?');
            userValues.push(name);
        }
        if (avatar !== undefined && avatar !== null && avatar !== "" && avatar !== "undefined") {
            userUpdates.push('avatar = ?');
            userValues.push(avatar);
        }

        if (userUpdates.length > 0) {
            userValues.push(userId);
            await pool.query(`UPDATE tbl_users SET ${userUpdates.join(', ')} WHERE id = ?`, userValues);
        }

        // 2. Update company table (industry, description, location)
        // 2. Update ឬ Insert ចូលតារាង company (industry, description, location)
        const compUpdates = [];
        const compValues = [];

        if (industry !== undefined && industry !== null && industry !== "" && industry !== "undefined") { compUpdates.push('industry = ?'); compValues.push(industry); }
        if (description !== undefined && description !== null && description !== "" && description !== "undefined") { compUpdates.push('description = ?'); compValues.push(description); }
        if (location !== undefined && location !== null && location !== "" && location !== "undefined") { compUpdates.push('location = ?'); compValues.push(location); }

        if (compUpdates.length > 0) {
            // ឆែកមើលសិនថាតើ User នេះមាន Profile ក្នុង tbl_companies ហើយឬនៅ
            const [existingCompany] = await pool.query(`SELECT id FROM tbl_companies WHERE user_id = ?`, [userId]);

            if (existingCompany.length > 0) {
                // បើមានហើយ ធ្វើការ UPDATE ធម្មតា
                compValues.push(userId);
                await pool.query(`UPDATE tbl_companies SET ${compUpdates.join(', ')} WHERE user_id = ?`, compValues);
            } else {
                // បើមិនទាន់មានទេ ធ្វើការ INSERT ថ្មីចូលតែម្តង
                // បង្កើត Object សម្រាប់ Insert ងាយស្រួលគ្រប់គ្រង
                const insertSql = `
            INSERT INTO tbl_companies (user_id, industry, description, location, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())
        `;
                await pool.query(insertSql, [userId, industry || null, description || null, location || null]);
            }
        }

        return this.getCompanyByUserId(userId);
    }
    // ----- Jobs -----
    async createJob(companyId, data) {
        const {
            category_id, title, thumbnail, description,
            requirements, type, location, salary_min, salary_max,
            status, expired_at
        } = data;
        const sql = `
        INSERT INTO tbl_jobs
        (company_id, category_id, title, thumbnail, description,
         requirements, type, location, salary_min, salary_max,
         status, expired_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
        const [result] = await pool.query(sql, [
            companyId, category_id, title, thumbnail, description,
            requirements, type, location, salary_min, salary_max,
            status, expired_at
        ]);
        return result.insertId;
    }

    async getJobById(jobId, companyId = null) {
        let sql = `
            SELECT j.*, c.user_id as company_name, cat.name as category_name
            FROM tbl_jobs j
            JOIN tbl_companies c ON j.company_id = c.id
            JOIN tbl_categories cat ON j.category_id = cat.id
            WHERE j.id = ?
        `;
        const params = [jobId];
        if (companyId) {
            sql += ' AND j.company_id = ?';
            params.push(companyId);
        }
        const [rows] = await pool.query(sql, params);
        return rows[0] || null;
    }

    async getJobsByCompany(companyId) {
        console.log(companyId);

        const sql = `
            SELECT j.*, cat.name as category_name
            FROM tbl_jobs j
            JOIN tbl_categories cat ON j.category_id = cat.id
            WHERE j.company_id = ?
            ORDER BY j.created_at DESC
        `;
        const [rows] = await pool.query(sql, [companyId]);
        return rows;
    }

    async updateJob(jobId, companyId, data) {
        const fields = [];
        const values = [];
        for (const [key, val] of Object.entries(data)) {
            if (val !== undefined && key !== 'id' && key !== 'company_id') {
                fields.push(`${key} = ?`);
                values.push(val);
            }
        }
        if (!fields.length) return this.getJobById(jobId, companyId);
        values.push(jobId, companyId);
        const sql = `UPDATE tbl_jobs SET ${fields.join(', ')} WHERE id = ? AND company_id = ?`;
        await pool.query(sql, values);
        return this.getJobById(jobId, companyId);
    }

    async deleteJob(jobId, companyId) {
        const sql = `DELETE FROM tbl_jobs WHERE id = ? AND company_id = ?`;
        const [result] = await pool.query(sql, [jobId, companyId]);

        // ត្រូវ return true បើសិនជាមានការលុបជោគជ័យ (affectedRows ធំជាង 0)
        return result.affectedRows > 0;
    }

    // ----- Applications -----
    async getApplicationsByJob(jobId, companyId) {
        const sql = `
            SELECT a.*, u.name, u.email, sk.phone, sk.skill, sk.cv
            FROM tbl_applications a
            JOIN tbl_jobs j ON a.job_id = j.id
            JOIN tbl_seekers sk ON a.seeker_id = sk.user_id
            JOIN tbl_users u ON sk.user_id = u.id
            WHERE a.job_id = ? AND j.company_id = ?
            ORDER BY a.applied_at DESC
        `;
        const [rows] = await pool.query(sql, [jobId, companyId]);
        return rows;
    }

    async getAllApplicationsByCompany(companyId) {
        const sql = `
            SELECT a.*, u.name, u.email, sk.phone, sk.skill, sk.cv, j.title as job_title
            FROM tbl_applications a
            JOIN tbl_jobs j ON a.job_id = j.id
            JOIN tbl_seekers sk ON a.seeker_id = sk.user_id
            JOIN tbl_users u ON sk.user_id = u.id
            WHERE j.company_id = ?
            ORDER BY a.applied_at DESC
        `;
        const [rows] = await pool.query(sql, [companyId]);
        return rows;
    }

    async updateApplicationStatus(applicationId, companyId, status, reviewerId) {
        // Verify ownership
        const checkSql = `
            SELECT a.id FROM tbl_applications a
            JOIN tbl_jobs j ON a.job_id = j.id
            WHERE a.id = ? AND j.company_id = ?
        `;
        const [check] = await pool.query(checkSql, [applicationId, companyId]);
        if (check.length === 0) return null;

        // Get old status for log
        const [old] = await pool.query('SELECT status FROM tbl_applications WHERE id = ?', [applicationId]);
        const oldStatus = old[0]?.status || 'unknown';

        // Update status
        await pool.query(
            `UPDATE tbl_applications SET status = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
            [status, reviewerId, applicationId]
        );

        // Insert log
        await pool.query(
            `INSERT INTO application_status_log
            (application_id, change_by, old_status, new_status, note, changed_at)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [applicationId, reviewerId, oldStatus, status, `Status changed by company`]
        );

        return { applicationId, status };
    }
}

module.exports = CompanyModel;