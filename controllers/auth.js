const auth = require('../services/auth');

const register = async(req,res)=>{

    try{
        let result = await auth.register(req.body);
        console.log(req.body.name);
        
        res.status(201).json({
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
const verifyEmail = async(req,res)=>{
    try{
        console.log(req.body);
        let result = await auth.verifyEmail(req.query.token);
        res.json({
            result: true,
            msg: "Verify Email Success fully"
        })

    }catch(error){
        res.json({
            result: false,
            msg: error.message
        })
    }
}

module.exports = {
    register,
    verifyEmail
}