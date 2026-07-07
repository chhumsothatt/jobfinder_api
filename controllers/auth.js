const auth = require('../services/auth');

const register = async(req,res)=>{

    try{
        let result = await auth.register(req.body);
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
        
        let result = await auth.verifyEmail(req.query.token);
        res.json({
            result: true,
            msg: result.message 
        })
        console.log('Verify email successfully');

    }catch(error){
        res.json({
            result: false,
            msg: error.message
        })
        console.log("Verify Email Faild");
        
    }
}

// resendverificationEmail
const resendVerificationEmail = async(req,res)=>{
    
    try{
        let result = await auth.resendverificationEmail(req.body);
        res.status(200).json({
            result: true,
            msg: result.message,
            // data: result
        })
    }catch(error){
        res.json({
            result: false,
            msg: error.message
        })
    }
}

// user login
const login = async(req,res)=>{
    console.log(req);
    
    try{
        let row = await auth.login(req.body);
        res.status(200).json({
            result: true,
            msg: "Login Successfully",
            data: row
        })
    }catch(error){
        res.status(400).json({
            result: false,
            msg: error.message
        })
    }
}

// logout user
const logout = async(req,res)=>{
    try {
        await auth.logout(req.user.id);
        res.status(200).json({
            result: true,
            msg: "Logout Successfully"
        })
    } catch (error) {
        res.status(422).json({
            result: false,
            msg: "Logout Fails"
        })
    }
    
    
}

module.exports = {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    logout
}