const express = require('express');
const router = express.Router();
const {registerSchema,loginSchema} = require('../validators/user');
const {isLogin} = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {register,verifyEmail,resendVerificationEmail,login,logout} = require('../controllers/auth');
router.get('/',(req,res)=>{
    res.json({
        result: true,
        msg: "Welcome Jobfinder"
    })
})
router.post('/register',validate(registerSchema),register);
router.get('/verifyemail',verifyEmail);
router.put('/resendverificationemail',resendVerificationEmail);
router.post('/login',validate(loginSchema),login);
router.delete('/logout',isLogin,logout);
module.exports = router;