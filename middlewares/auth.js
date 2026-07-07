const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs//jwt');
const user = require('../models/users');

const isLogin = async(req,res,next) => {
    
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.json({
            result: false,
            msg: "Your Need Login",
        });
    }
    const  

}