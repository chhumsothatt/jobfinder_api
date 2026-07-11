const profileModel = require('../../models/seekers/profile');

const getProfile = async (userId) => {
    const rows = await profileModel.getProfile(userId);
    if (!rows || rows.length === 0) {
        throw new Error('Profile not found');
    }
    return rows[0];
};

const updateAvatar = async (userId, avatarUrl) => {
    if (!avatarUrl) {
        throw new Error('Avatar URL is required');
    }
    const result = await profileModel.updateAvatar(userId, avatarUrl);
    if (result.affectedRows === 0) {
        throw new Error('Avatar update failed');
    }
    return { message: 'Avatar updated successfully' };
};

const updateProfile = async (userId, body) => {
    const { name, headline, bio, phone, location } = body;
    if (!name || !headline || !bio || !phone || !location) {
        throw new Error('Missing required fields: name, headline, bio, phone, location');
    }
    await profileModel.updateProfile(userId, body);
    return { message: 'Profile updated successfully' };
};

const uploadCv = async (userId, filename) => {
    if (!filename) {
        throw new Error('Filename is required');
    }
    const result = await profileModel.uploadCv(userId, filename);
    if (result.affectedRows === 0) {
        throw new Error('CV upload failed');
    }
    return { message: 'CV uploaded successfully', cvId: result.insertId };
};

const updateSkill = async (userId, skill) => {
    if (!skill) {
        throw new Error('Skill is required');
    }
    const result = await profileModel.updateSkill(skill, userId);
    if (result.affectedRows === 0) {
        throw new Error('Skill update failed – user skill record not found');
    }
    return { message: 'Skill updated successfully' };
};

const updateExperience = async (experienceId, data) => {
    const { company_name, position, start_date, end_date, description } = data;
    if (!company_name || !position || !start_date || !end_date || !description) {
        throw new Error('Missing required experience fields');
    }
    const result = await profileModel.updateExperience(
        company_name,
        position,
        start_date,
        end_date,
        description,
        experienceId
    );
    if (result.affectedRows === 0) {
        throw new Error('Experience update failed – record not found');
    }
    return { message: 'Experience updated successfully' };
};

module.exports = {
    getProfile,
    updateAvatar,
    updateProfile,
    uploadCv,
    updateSkill,
    updateExperience,
};