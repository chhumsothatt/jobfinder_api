const applicationService = require('../../services/seekers/aplicationService');

class applicationController{
    async getAllSeeker(req,res){
        try {
            const data = await applicationService.getAllSeeker();
            res.status(200).json({
                status: "success",
                data: data
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }

    async getSeekerDetail(req,res){
        try {
            const seekerId = parseInt(req.query.userid);
            const data = await applicationService.getSeekerDetail(seekerId);
            if(!data){
                throw new Error('Seeker not found');
            }
            res.status(200).json({
                status: "success",
                data: data
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }
}

module.exports = new applicationController();