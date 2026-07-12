const profileModel = require('../../models/seekers/profile');

const getProfile = async (userId) => {
    console.log('Fetching profile for userId:', userId);
    const rows = await profileModel.getProfile(userId);
    if (!rows || rows.length === 0) {
        throw new Error('Profile not found');
    }
    return rows[0];
};

const updateAvatar = async (userId, avatarFileName) => {
    if (!avatarFileName) {
        throw new Error('Avatar file name is required');
    }

    const result = await profileModel.updateAvatar(userId, avatarFileName);

    if (result.affectedRows === 0) {
        throw new Error('Avatar update failed. User not found.');
    }

    return { message: 'Profile avatar updated successfully' };
};

const updateProfile = async (userId, bodyData, file) => {
    let cvPath = null;
    if (file) {
        cvPath = file.path;
    }

    const profileData = {
        name: bodyData.name,
        headline: bodyData.headline,
        bio: bodyData.bio,
        phone: bodyData.phone,
        location: bodyData.location,
        skill: bodyData.skill,
        cv: cvPath
    };

    if (!profileData.name) {
        throw new Error('Name is required');
    }

    // Now call the model function (not itself) thanks to the alias
    const result = await profileModel.updateProfile(userId, profileData);
    return result;
};

// create Experience
const createExperience = async (userId, data) => {
    const { company_name, position, start_date, end_date, description } = data;
    if (!company_name || !position || !start_date || !end_date || !description) {
        throw new Error('Missing required fields');
    }

    const seeker = await profileModel.getSeekerByUserId(userId);
    if (!seeker) {
        throw new Error('Seeker profile not found');
    }

    const result = await profileModel.createExperience(seeker.id, data);
    if (result.affectedRows === 0) {
        throw new Error('Failed to create experience');
    }

    return { message: 'Experience added successfully', experienceId: result.insertId };
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
    updateExperience,
    createExperience
};