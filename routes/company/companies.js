const express = require('express');
const router = express.Router();
const upload = require("../../configs/multer");

const CompanyModel = require('../../models/company/companyModel');   // កែផ្លូវឲ្យត្រូវ
const CompanyService = require('../../services/company/companyService');
const CompanyController = require('../../controllers/company/companyController');
const { isLogin } = require('../../middlewares/auth');

const model = new CompanyModel();
const service = new CompanyService(model);
const controller = new CompanyController(service);   // ✅ ត្រឹមត្រូវ

router.get('/profile', isLogin, controller.getProfile);
router.post('/profile/update', isLogin, upload.single('avatar'), controller.updateProfile);

router.get('/jobs', isLogin, controller.viewJobs);
router.get('/jobs/:jobId', isLogin, controller.viewJobDetail);
router.post('/jobs/create', isLogin, upload.single('thumbnail'), controller.createJob);
router.put('/jobs/:jobId/update', isLogin, controller.updateJob);
router.delete('/jobs/:jobId/delete', isLogin, controller.deleteJob);

router.get('/applications', isLogin, controller.allApplications);
router.get('/jobs/:jobId/applications', isLogin, controller.viewApplicationsForJob);
router.post('/applications/:applicationId/accept', isLogin, controller.acceptApplication);
router.post('/applications/:applicationId/reject', isLogin, controller.rejectApplication);

module.exports = router;