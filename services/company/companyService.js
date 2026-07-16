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
        if (!company) throw new Error('Company profile not found');

        // data នៅទីនេះមានផ្ទុក thumbnail (ឈ្មោះ file) រួចជាស្រេចពី Controller
        const jobId = await this.model.createJob(company.id, data);
        return this.model.getJobById(jobId);
    }

    async getJobs(userId) {
        const company = await this.model.getCompanyByUserId(userId);
        if (!company) throw new Error('Company profile not found');
        return this.model.getJobsByCompany(company.id);
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