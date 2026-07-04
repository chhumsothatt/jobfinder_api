const express = require('express');
const router = express.Router();

const {register,verifyEmail} = require('../controllers/auth');
router.get('/',(req,res)=>{
    res.json({
        result: true,
        msg: "Welcome Jobfinder"
    })
})
router.post('/register',register);
router.get('/verifyemail',verifyEmail)

module.exports = router;