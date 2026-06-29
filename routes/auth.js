const express = require('express');
const router = express.Router();

const {register} = require('../controllers/auth');
router.get('/',(req,res)=>{
    res.json({
        result: true,
        msg: "Welcome Jobfinder"
    })
})
router.post('/register',register);

module.exports = router;