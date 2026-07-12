const express = require("express");
const app = express();

app.use(express.json());
require('dotenv').config();

const auth = require('./routes/auth');
const profile = require('./routes/seekers/profile');

app.use('/api/auth',auth);
app.use('/api/seekers',profile);

app.listen(3000,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})