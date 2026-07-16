const pool = require('../../configs/db');

class CompanyModel {
    // ----- Profile -----
    async getCompanyByUserId(userId) {
        const sql = `
            SELECT c.*, u.name, u.email, u.avatar
            FROM tbl_companies c 
            JOIN tbl_users u ON c.user_id = u.id
            WHERE c.user_id = ?
        `;
        const [rows] = await pool.query(sql, [userId]);
        console.log(rows);
        
        return rows[0] || null;
    }

    async updateCompanyProfile(userId, data) {
        const { name, avatar, industry, description, location } = data;

        // Update user table (name, avatar)
        if (name || avatar) {
            const updates = [];
            const values = [];
            if (name) { updates.push('name = ?'); values.push(name); }
            if (avatar) { updates.push('avatar = ?'); values.push(avatar); }
            values.push(userId);
            await pool.query(`UPDATE tbl_users SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        // Update company table
        const compUpdates = [];
        const compValues = [];
        if (industry) { compUpdates.push('industry = ?'); compValues.push(industry); }
        if (description) { compUpdates.push('description = ?'); compValues.push(description); }
        if (location) { compUpdates.push('location = ?'); compValues.push(location); }
        if (compUpdates.length) {
            compValues.push(userId);
            await pool.query(`UPDATE tbl_companies SET ${compUpdates.join(', ')} WHERE user_id = ?`, compValues);
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
            SELECT j.*, c.name as company_name, cat.name as category_name
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
        const sql = 'DELETE FROM tbl_jobs WHERE id = ? AND company_id = ?';
        const [result] = await pool.query(sql, [jobId, companyId]);
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