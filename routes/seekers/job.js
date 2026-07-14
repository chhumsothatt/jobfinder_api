const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/seekers/jobController');

router.get('/viewalljobs', jobController.viewAllJobs);
router.get('/jobdetails/:id', jobController.jobDetails);
router.get('/searchjob', jobController.searchByCategory);

module.exports = router;