const express = require('express');
const router = express.Router();
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { getProfile, updateAvatar, updateProfile, uploadCv, updateSkill, updateExperience,createExperience } = require('../../controllers/seekers/profile');
const upload = require('../../configs/multer');

// get profile
router.get('/getme', isLogin, getProfile);

// update avatar
router.put('/avatar', isLogin, upload.single('avatar'), updateAvatar);

// update profile 
router.put('/updateprofile', isLogin, updateProfile);

// upload cv
router.post('/updateprofile/cv',isLogin,uploadCv);

// update skill
router.put('/updateprofile/skill',isLogin,updateSkill);

// update experience
router.put('/updateprofile/experience',isLogin,updateExperience);

// create experience
router.post('/profile/createexperience', isLogin, createExperience);

module.exports = router;