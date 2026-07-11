const profileService = require('../../services/seekers/profile');

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // assume auth middleware sets req.user
        const profile = await profileService.getProfile(userId);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

const updateAvatar = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { avatar } = req.body;
        if (!avatar) {
            return res.status(400).json({ success: false, message: 'Avatar URL is required' });
        }
        const result = await profileService.updateAvatar(userId, avatar);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await profileService.updateProfile(userId, req.body);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

const uploadCv = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { filename } = req.body; // or from multer: req.file.filename
        if (!filename) {
            return res.status(400).json({ success: false, message: 'Filename is required' });
        }
        const result = await profileService.uploadCv(userId, filename);
        res.status(201).json({ success: true, message: result.message, cvId: result.cvId });
    } catch (error) {
        next(error);
    }
};

const updateSkill = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { skill } = req.body;
        if (!skill) {
            return res.status(400).json({ success: false, message: 'Skill is required' });
        }
        const result = await profileService.updateSkill(userId, skill);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

const updateExperience = async (req, res, next) => {
    try {
        const experienceId = req.params.id;
        const result = await profileService.updateExperience(experienceId, req.body);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateAvatar,
    updateProfile,
    uploadCv,
    updateSkill,
    updateExperience,
};