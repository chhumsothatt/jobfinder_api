const auth = require('../services/auth');

const register = async (req,res)=>{
    try{
        console.log(req.body);
        
        let result = await auth.register(req.body);
        res.json({
            result: true,
            msg: "Register User Successfully",

            data: result
        });
    }catch(error){
        res.json({
            result: false,
            msg: error.message
        })
        
    }
}

module.exports = {
    register
};