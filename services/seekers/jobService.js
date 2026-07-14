const jobModel = require('../../models/seekers/jobModel');

const getAllJobs = async () => {
    try {
        const jobs = await jobModel.getAlljob();
        return jobs;
    } catch (error) {
        throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
};

const getJobDetail = async (jobId) => {
    if (!jobId || isNaN(jobId)) {
        throw new Error('Invalid job ID');
    }
    try {
        const job = await jobModel.getJobDetail(jobId);
        if (!job) {
            throw new Error('Job not found');
        }
        return job;
    } catch (error) {
        throw new Error(`Failed to fetch job details: ${error.message}`);
    }
};

const searchJobsByCategory = async (categoryName) => {
    if (!categoryName || categoryName.trim() === '') {
        throw new Error('Category name is required');
    }
    try {
        const jobs = await jobModel.searchJobByCategory(categoryName.trim());
        return jobs;
    } catch (error) {
        throw new Error(`Failed to search jobs: ${error.message}`);
    }
};

module.exports = {
    getAllJobs,
    getJobDetail,
    searchJobsByCategory
};