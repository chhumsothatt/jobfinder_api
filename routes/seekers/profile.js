const express = require('express');
const router = express.Router();
const {isLogin} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {getProfile,updateAvatar,updateProfile,uploadCv,updateSkill,updateExperience} = require('../../controllers/seekers/profile');


// get profile
router.get('/getprofile',isLogin,getProfile);

// update profile
router.put('/updateprofile',isLogin,validate(),updateProfile);

// upload cv
router.post('/updateprofile/cv',isLogin,uploadCv);

// update skill
router.put('/updateprofile/skill',isLogin,updateSkill);

// update experience
router.put('/updateprofile/experience',isLogin,updateExperience);

module.exports = router;