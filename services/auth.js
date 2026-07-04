const user = require('../models/users');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const mailService = require('./mailService');

const register = async (body) => {

    // if empty
    if (!body.name || !body.email || !body.password) {
        throw new Error("Name, Email, Password is required");
    }
    
    // duplicate
    let checkemail = await user.findByEmail(body.email);
    if (checkemail.length > 0) {
        throw new Error("Duplicate Email");
    }
    
    // hash password 10
    console.log(body.email);
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // random token 32 
    let verificationToken = crypto.randomBytes(32).toString('hex');
    
    // 1 day 
    let verificationExpired = new Date(Date.now() + 24 * 60 * 60 * 1000); //  1 day
    
    const result = await user.register({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        verificationToken: verificationToken,
        verificationExpired: verificationExpired
    });

    await mailService.sendVerificationEmail(body.email, verificationToken);
    
    let row = await user.findById(result);
    return row;
}

const verifyEmail = async(token)=>{
    console.log(token);
    
    if(!token){
        throw new Error('verify token is require');
    }
    
}

module.exports = {
    register,
    verifyEmail
}