const express = require("express");
const router = express.Router();

const model = require("../../models/seekers/companyModel");
const service = require("../../services/seekers/companyService");
const controller = require("../../controllers/seekers/companyController");

router.get('/viewcompany',controller.getAllCompany);
router.get('/detail',controller.getCompanyDetail);
router.post('/search',controller.searchCompanies);
router.post('/create',controller.createCompany);
router.put('/update',controller.updateCompany);
router.delete('/delete',controller.deleteCompany);

module.exports = router;