const express = require('express');
const router = express.Router();

// Import Model, Service, Controller
const CompanyModel = require('../../models/company/companyModel');   // កែផ្លូវឲ្យត្រូវ
const CompanyService = require('../../services/company/companyService');
const CompanyController = require('../../controllers/company/companyController');

// Instantiate (ត្រូវប្រើ new និងបញ្ជូន service)
const model = new CompanyModel();
const service = new CompanyService(model);
const controller = new CompanyController(service);   // ✅ ត្រឹមត្រូវ

// Uncomment if you have auth middleware
// const auth = require('../../middlewares/auth');
// router.use(auth);

// ----- Routes -----
router.get('/profile', controller.getProfile);
router.post('/profile/update', controller.updateProfile);

router.get('/jobs', controller.viewJobs);
router.get('/jobs/:jobId', controller.viewJobDetail);
router.post('/jobs/create', controller.createJob);
router.put('/jobs/:jobId/update', controller.updateJob);
router.delete('/jobs/:jobId/delete', controller.deleteJob);

router.get('/applications', controller.allApplications);
router.get('/jobs/:jobId/applications', controller.viewApplicationsForJob);
router.post('/applications/:applicationId/accept', controller.acceptApplication);
router.post('/applications/:applicationId/reject', controller.rejectApplication);

module.exports = router;