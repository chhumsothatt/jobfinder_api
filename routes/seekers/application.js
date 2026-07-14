const express = require('express');
const applicationController = require('../../controllers/seekers/applcationController');


const router = express.Router();

router.get('/allseekers',applicationController.getAllSeeker);
router.get('/detail',applicationController.getSeekerDetail);

module.exports = router;
