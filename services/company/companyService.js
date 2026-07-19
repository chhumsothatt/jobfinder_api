class CompanyService {
    constructor(model) {
        this.model = model;
    }

    // ----- Profile -----
    async getProfile(userId) {
        return this.model.getCompanyByUserId(userId);
    }

    async updateProfile(userId, data) {
        return this.model.updateCompanyProfile(userId, data);
    }

    // ----- Jobs -----
    async createJob(userId, data) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company || !company.company_id) {
            throw new Error('Company profile not found. Please update your profile first.');
        }

        // ប្រើ company.company_id ជំនួស company.id វិញ
        const jobId = await this.model.createJob(company.company_id, data);
        return this.model.getJobById(jobId);
    }

    // នៅក្នុង Service
    async getJobs(userId) {
        const company = await this.model.getCompanyByUserId(userId);

        // ប្រសិនបើអត់មាន profile company ទេ
        if (!company || !company.company_id) {
            throw new Error('Company profile not found');
        }

        // ប្តូរពី company.id ទៅជា company.company_id វិញ
        return this.model.getJobsByCompany(company.company_id);
    }

    async getJobDetail(userId, jobId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.getJobById(jobId, company.id);
    }

    async updateJob(userId, jobId, data) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.updateJob(jobId, company.id, data);
    }

    async deleteJob(userId, jobId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.deleteJob(jobId, company.id);
    }

    // ----- Applications -----
    async getApplicationsForJob(userId, jobId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.getApplicationsByJob(jobId, company.id);
    }

    async getAllApplications(userId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.getAllApplicationsByCompany(company.id);
    }

    async acceptApplication(userId, applicationId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.updateApplicationStatus(applicationId, company.id, 'accept', userId);
    }

    async rejectApplication(userId, applicationId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.updateApplicationStatus(applicationId, company.id, 'reject', userId);
    }
}

module.exports = CompanyService;