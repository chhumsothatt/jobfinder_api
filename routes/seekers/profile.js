const express = require('express');
const router = express.Router();
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { getProfile, updateAvatar, updateProfile,createExperience } = require('../../controllers/seekers/profile');
const upload = require('../../configs/multer');

// get profile
router.get('/getme', isLogin, getProfile);

// update avatar
router.put('/avatar', isLogin, upload.single('avatar'), updateAvatar);

// update profile 
router.put('/updateprofile', isLogin, upload.single('cv'), updateProfile);

// update experience
// router.put('/updateprofile/experience',isLogin,updateExperience);

// create experience
router.post('/profile/createexperience', isLogin, createExperience);

module.exports = router;