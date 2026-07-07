const user = require("../models/users");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mailService = require("./mailService");
const jwtConfig = require('../configs/jwt');
const jwt = require('jsonwebtoken'); // for create token
// ===============register
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
  let verificationToken = crypto.randomBytes(32).toString("hex");

  // 1 day
  let verificationExpired = new Date(Date.now() + 24 * 60 * 60 * 1000); //  1 day

  const result = await user.register({
    name: body.name,
    email: body.email,
    password: hashedPassword,
    verificationToken: verificationToken,
    verificationExpired: verificationExpired,
  });

  await mailService.sendVerificationEmail(body.email, verificationToken);

  let row = await user.findById(result);
  return row;
};

//==============================================verify email
const verifyEmail = async (token) => {
  if (!token || token.trim() === "") {
    throw new Error("Verification token is required");
  }

  // find user by token
  const userInfo = await user.findByVerificationToken(token);
  
  if (userInfo.length == 0) {
    throw new Error("Invalid verification token");
  }

  console.log(userInfo[0].is_verify);
  if (userInfo[0].is_verify == '1') {
    throw new Error("Email Already Verified");
  }
  console.log(userInfo[0].verification_expired);
  console.log(new Date(userInfo[0].verification_expired));
  console.log(new Date());
  if (
    !userInfo[0].verification_expired ||
    new Date(userInfo[0].verification_expired) < new Date()
  ) {
    throw new Error("Verification token has expired");
  }

  await user.verifyEmail(userInfo[0].id);
  console.log(userInfo[0].id);
  return { message: "Email Verified Successfully" };
};

// resendverificationEmail
const resendverificationEmail = async (body)=>{
  if(!body.email){
    throw new Error ("Email is Required");
  }
  const userInfo = await user.findByEmail(body.email);
  
  if(userInfo.length == 0){
    throw new Error("Email Not Found");
    
  }
  if(userInfo[0].is_verify == '1'){
    throw new Error("Email Already Verified");
    
  }
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verification_expired = new Date(Date.now() + 60 * 60 * 1000);

  await user.resendVerificationEmail({
    email: body.email,
    verificationToken: verificationToken,
    verificationExpired: verification_expired,
  });

  await mailService.sendVerificationEmail(body.email, verificationToken);

  let row = await user.findById(userInfo[0].id);
   return { message: 'Verification email resent successfully' }
    
}

// user login
const login = async(body) =>{
  if(!body.email || !body.password){
    throw new Error("Email and Password is Required");
  }
  const userInfo = await user.findByEmail(body.email);
  if(userInfo.length == 0){
    throw new Error("Email Not Found");
  }
  if(userInfo[0].is_verify == '0'){
    throw new Error("Email Not Verified");
  }
  const passwordMatch = await bcrypt.compare(body.password,userInfo[0].password);
  if(!passwordMatch){
    throw new Error("Invalid Password");
  }
  const token = jwt.sign(
    {id: userInfo[0].id,email: userInfo[0].email},
    jwtConfig.secret,
    {expiresIn: jwtConfig.expiresIn}
  )
  await user.addToken(token,userInfo[0].id);
  let row = user.findById(userInfo[0].id);
console.log(row);

  return row;
  
}

// logout user
const logout= async(id) =>{
  await user.deleteToken(id);
  return { message: 'Logout successfully' }
}

// forgot password
// const forgotPassword = async(body) =>{
//   if(!body.email){
//     throw new Error("Email is Required");
//   }
//   const userInfo = await user.findByEmail(body.email);
//   if(userInfo.length == 0){
//     throw new Error("Email Not Found");
//   }
//   if(userInfo[0].is_verify == '0'){
//     throw new Error("Email Not Verified");
//   }
//   const verificationToken = crypto.randomBytes(32).toString('hex');
//   const verification_expired = new Date(Date.now() + 60 * 60 * 1000);
//   await user.resendVerificationEmail({
//     email: body.email,
//     verificationToken: verificationToken,
//     verificationExpired: verification_expired,
//   });
//   await mailService.sendVerificationEmail(body.email, verificationToken);
//   let row = await user.findById(userInfo[0].id);
//    return { message: 'Verification email resent successfully' }
// }

// reset password
// const resetPassword = async(body) =>{
//   if(!body.email || !body.password){
//     throw new Error("Email and Password is Required");
//   }
//   const userInfo = await user.findByEmail(body.email);
//   if(userInfo.length == 0){
//     throw new Error("Email Not Found");
//   }
//   if(userInfo[0].is_verify == '0'){
//     throw new Error("Email Not Verified");
//   }
//   const passwordMatch = await bcrypt.compare(body.password,userInfo[0].password);
//   if(!passwordMatch){
//     throw new Error("Invalid Password");
//   }
//   const token = jwt.sign(
//     {id: userInfo[0].id,email: userInfo[0].email},
//     jwtConfig.secret,
//     {expiresIn: jwtConfig.expiresIn}
//   )
//   await user.addToken(token,userInfo[0].id);
//   let row = user.findById(userInfo[0].id);
// console.log(row);

//   return row;
// }

module.exports = {
  register,
  verifyEmail,
  resendverificationEmail,
  login,
  logout,
};
