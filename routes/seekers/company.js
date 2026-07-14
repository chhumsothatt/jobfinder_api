const express = require('express');
const router = express.Router();
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { companyIdSchema, companySearchSchema, companyCreateSchema } = require('../../validators/companyValidation');
const companyController = require('../../controllers/seekers/companyController');

// Public routes
router.get('/viewcompany', companyController.getAllCompanies);
router.get('/search', validate(companySearchSchema, 'query'), companyController.searchCompanies);
router.get('/detail/:id', validate(companyIdSchema, 'params'), companyController.getCompanyDetail);

// Protected routes (require login)
router.post('/create', isLogin, validate(companyCreateSchema, 'body'), companyController.createCompany);
router.put('/update/:id', isLogin, validate(companyIdSchema, 'params'), validate(companyCreateSchema, 'body'), companyController.updateCompany);
router.delete('/delete/:id', isLogin, validate(companyIdSchema, 'params'), companyController.deleteCompany);

module.exports = router;