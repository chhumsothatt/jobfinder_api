const user = require('../models/users');

const register = async (body)=>{
    console.log(body.name);
    
    if(!body.name || !body.email ||body.password){
        throw new Error("name, email , password is required");
    }
    let result = await user.create({
        name:body.name,
        email:body.email,
        password: body.password
    });

    return result;
}

module.exports = {
    register
};