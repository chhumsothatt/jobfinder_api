const auth = require('../services/auth');

const register = async(req,res)=>{
    try{
        let result = await auth.register(req.body);
        console.log(req.body.name);
        
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
}