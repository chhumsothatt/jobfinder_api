class CompanyController {
    constructor(service) {
        this.service = service;
    }

    // ----- Profile -----
    getProfile = async (req, res) => {
        try {
            const userId = req.user.id; // from auth middleware
            console.log(userId);
            
            const profile = await this.service.getProfile(userId);
            if (!profile) {
                return res.status(404).json({ status: 'error', message: 'Company profile not found' });
            }
            res.json({ status: 'success', data: profile });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    updateProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const updated = await this.service.updateProfile(userId, req.body);
            res.json({ status: 'success', data: updated });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // ----- Jobs -----
    createJob = async (req, res) => {
        try {
            const userId = req.user.id;
            const job = await this.service.createJob(userId, req.body);
            res.status(201).json({ status: 'success', data: job });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    viewJobs = async (req, res) => {
        try {
            const userId = req.user.id;
            const jobs = await this.service.getJobs(userId);
            res.json({ status: 'success', data: jobs });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    viewJobDetail = async (req, res) => {
        try {
            const userId = req.user.id;
            const jobId = parseInt(req.params.jobId);
            const job = await this.service.getJobDetail(userId, jobId);
            if (!job) {
                return res.status(404).json({ status: 'error', message: 'Job not found' });
            }
            res.json({ status: 'success', data: job });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    updateJob = async (req, res) => {
        try {
            const userId = req.user.id;
            const jobId = parseInt(req.params.jobId);
            const updated = await this.service.updateJob(userId, jobId, req.body);
            if (!updated) {
                return res.status(404).json({ status: 'error', message: 'Job not found or unauthorized' });
            }
            res.json({ status: 'success', data: updated });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    deleteJob = async (req, res) => {
        try {
            const userId = req.user.id;
            const jobId = parseInt(req.params.jobId);
            const deleted = await this.service.deleteJob(userId, jobId);
            if (!deleted) {
                return res.status(404).json({ status: 'error', message: 'Job not found or unauthorized' });
            }
            res.json({ status: 'success', message: 'Job deleted successfully' });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // ----- Applications -----
    viewApplicationsForJob = async (req, res) => {
        try {
            const userId = req.user.id;
            const jobId = parseInt(req.params.jobId);
            const applications = await this.service.getApplicationsForJob(userId, jobId);
            res.json({ status: 'success', data: applications });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    allApplications = async (req, res) => {
        try {
            const userId = req.user.id;
            const applications = await this.service.getAllApplications(userId);
            res.json({ status: 'success', data: applications });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    acceptApplication = async (req, res) => {
        try {
            const userId = req.user.id;
            const applicationId = parseInt(req.params.applicationId);
            const result = await this.service.acceptApplication(userId, applicationId);
            if (!result) {
                return res.status(404).json({ status: 'error', message: 'Application not found or unauthorized' });
            }
            res.json({ status: 'success', data: result });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    rejectApplication = async (req, res) => {
        try {
            const userId = req.user.id;
            const applicationId = parseInt(req.params.applicationId);
            const result = await this.service.rejectApplication(userId, applicationId);
            if (!result) {
                return res.status(404).json({ status: 'error', message: 'Application not found or unauthorized' });
            }
            res.json({ status: 'success', data: result });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    handleError(res, err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message || 'Internal Server Error' });
    }
}

module.exports = CompanyController;