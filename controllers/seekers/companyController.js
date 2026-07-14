const companyService = require('../../services/seekers/companyService');


const getAllCompanies = async (req, res) => {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json({
            success: true,
            data: companies,
            count: companies.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /companies/:id
 * Returns company details.
 */
const getCompanyDetail = async (req, res) => {
    const companyId = parseInt(req.params.id);
    try {
        const company = await companyService.getCompanyDetail(companyId);
        res.status(200).json({
            success: true,
            data: company
        });
    } catch (error) {
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /companies/search?keyword=...
 * Search companies by keyword.
 */
const searchCompanies = async (req, res) => {
    const { keyword } = req.query;
    console.log(keyword);
    
    try {
        const companies = await companyService.searchCompanies(keyword);
        res.status(200).json({
            success: true,
            data: companies,
            count: companies.length
        });
    } catch (error) {
        const status = error.message.includes('required') ? 400 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /companies
 * Create a new company (authenticated users).
 */
const createCompany = async (req, res) => {
    const userId = req.user?.id; // Assuming isLogin middleware adds user object
    try {
        const result = await companyService.createCompany(userId, req.body);
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        const status = error.message.includes('required') ? 400 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /companies/:id
 * Update company details.
 */
const updateCompany = async (req, res) => {
    const companyId = parseInt(req.params.id);
    const userId = req.user?.id;
    try {
        await companyService.updateCompany(companyId, userId, req.body);
        res.status(200).json({
            success: true,
            message: 'Company updated successfully'
        });
    } catch (error) {
        const status = error.message.includes('not found') ? 404 : 
                       error.message.includes('Unauthorized') ? 403 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * DELETE /companies/:id
 * Delete a company.
 */
const deleteCompany = async (req, res) => {
    const companyId = parseInt(req.params.id);
    const userId = req.user?.id;
    try {
        await companyService.deleteCompany(companyId, userId);
        res.status(200).json({
            success: true,
            message: 'Company deleted successfully'
        });
    } catch (error) {
        const status = error.message.includes('not found') ? 404 :
                       error.message.includes('Unauthorized') ? 403 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyDetail,
    searchCompanies,
    createCompany,
    updateCompany,
    deleteCompany
};