const aplicationModel = require('../../models/seekers/aplicationModel');

// class form
class applicationService{
    async getAllSeeker(){
        const data = await aplicationModel.getAllSeeker();
        if(!data){
            throw new Error('No seker');
        }
        return data;
    }

    async getSeekerDetail(seekerId){
        const data = await aplicationModel.getSeekerDetail(seekerId);
        if(!data){
            throw new Error('Seeker not found');
        }
        return data;
    }
}

module.exports = new applicationService();