const jobService = require('../../services/seekers/jobService');

/**
 * GET /jobs
 * Returns all active jobs.
 */
const viewAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const jobDetails = async (req, res) => {
    const jobId = parseInt(req.params.id);
    console.log(jobId);
    
    try {
        const job = await jobService.getJobDetail(jobId);
        res.status(200).json({
            success: true,
            data: job
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
 * GET /jobs/search?category=:categoryName
 * Searches jobs by category name.
 */
const searchByCategory = async (req, res) => {
    const { category } = req.query;
    console.log(category);
    
    try {
        const jobs = await jobService.searchJobsByCategory(category);
        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length
        });
    } catch (error) {
        const status = error.message.includes('required') ? 400 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    viewAllJobs,
    jobDetails,
    searchByCategory
};