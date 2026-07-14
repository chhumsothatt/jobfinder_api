const companyModel = require('../../models/seekers/companyModel');

/**
 * Get all companies with optional formatting.
 */
const getAllCompanies = async () => {
    try {
        const companies = await companyModel.getAllCompany();
        return companies.map(company => ({
            ...company,
            full_address: company.location || 'No location provided'
        }));
    } catch (error) {
        throw new Error(`Failed to fetch companies: ${error.message}`);
    }
};

/**
 * Get company detail by ID.
 */
const getCompanyDetail = async (companyId) => {
    if (!companyId || isNaN(companyId)) {
        throw new Error('Invalid company ID');
    }
    try {
        const company = await companyModel.getCompanyDetail(companyId);
        if (!company) {
            throw new Error('Company not found');
        }
        return company;
    } catch (error) {
        throw new Error(`Failed to fetch company details: ${error.message}`);
    }
};

/**
 * Search companies by keyword.
 */
const searchCompanies = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
        throw new Error('Search keyword is required');
    }
    try {
        const companies = await companyModel.searchCompanies(keyword.trim());
        return companies;
    } catch (error) {
        throw new Error(`Failed to search companies: ${error.message}`);
    }
};

/**
 * Create a new company.
 */
const createCompany = async (userId, companyData) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    const { industry, logo, description, location } = companyData;
    if (!industry || industry.trim() === '') {
        throw new Error('Industry is required');
    }
    try {
        const result = await companyModel.createCompany({
            user_id: userId,
            industry: industry.trim(),
            logo: logo || null,
            description: description || null,
            location: location || null
        });
        return result;
    } catch (error) {
        throw new Error(`Failed to create company: ${error.message}`);
    }
};

/**
 * Update an existing company.
 */
const updateCompany = async (companyId, userId, updateData) => {
    if (!companyId || isNaN(companyId)) {
        throw new Error('Invalid company ID');
    }
    try {
        // Check if company exists and belongs to user (optional auth check)
        const existing = await companyModel.getCompanyDetail(companyId);
        if (!existing) {
            throw new Error('Company not found');
        }
        // You can add authorization: if (existing.user_id !== userId) throw new Error('Unauthorized');
        
        const result = await companyModel.updateCompany(companyId, {
            industry: updateData.industry || existing.industry,
            logo: updateData.logo || existing.logo,
            description: updateData.description || existing.description,
            location: updateData.location || existing.location
        });
        return result;
    } catch (error) {
        throw new Error(`Failed to update company: ${error.message}`);
    }
};

/**
 * Delete a company.
 */
const deleteCompany = async (companyId, userId) => {
    if (!companyId || isNaN(companyId)) {
        throw new Error('Invalid company ID');
    }
    try {
        const existing = await companyModel.getCompanyDetail(companyId);
        if (!existing) {
            throw new Error('Company not found');
        }
        // Authorization: if (existing.user_id !== userId) throw new Error('Unauthorized');
        const result = await companyModel.deleteCompany(companyId);
        return result;
    } catch (error) {
        throw new Error(`Failed to delete company: ${error.message}`);
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