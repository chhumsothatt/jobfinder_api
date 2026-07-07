const express = require('express');
const router = express.Router();

const {register,verifyEmail,resendVerificationEmail,login,logout} = require('../controllers/auth');
router.get('/',(req,res)=>{
    res.json({
        result: true,
        msg: "Welcome Jobfinder"
    })
})
router.post('/register',register);
router.get('/verifyemail',verifyEmail);
router.put('/resendverificationemail',resendVerificationEmail);
router.post('/login',login);
router.delete('/logout',logout);
module.exports = router;