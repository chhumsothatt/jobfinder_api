
const user = require('../models/users');
const crypto = require("crypto");
const mailService = require('../configs/mailer');

const register = async(body)=>{

    if(!body.name || !body.email || !body.password){
        throw new Error("Name , Email , Password is required");
    }
    let checkemail = await user.findByEmail(body.email); // check duplicate email
    if(checkemail.length > 0){
        throw new Error("Duplicate Email");
    }
    const hasspassword = await bcrypt.hash(body.password,10); // bcrypt
    let verificationToken = crypto.randomBytes(32).toString('hex');
    let verificattionExpired = new Date(Date.now()+ 60 + 60 * 18000); // limit time for expired
    const result = await user.register({
        name: body.name,
        email: body.email,
        password: hasspassword,
        verificationToken,
        verificattionExpired
    });

    await mailService.sendVerificationEmail(body.email,verificationToken);
    console.log(result);
    let row = await user.findById(result);
    return row;

}

module.exports = {
    register
}