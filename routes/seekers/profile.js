const express = require('express');
const router = express.Router();
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { getProfile, updateAvatar, updateProfile,createExperience,getExperience } = require('../../controllers/seekers/profile');
const upload = require('../../configs/multer');

// get profile
router.get('/getme', isLogin, getProfile);

// update avatar
router.put('/avatar', isLogin, upload.single('avatar'), updateAvatar);

// update profile 
router.put('/updateprofile', isLogin, upload.single('cv'), updateProfile);

// create experience
router.post('/profile/createexperience', isLogin, createExperience);

// get experience
router.get('/getexperience', isLogin, getExperience);

module.exports = router;