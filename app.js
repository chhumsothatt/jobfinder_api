const express = require("express");
const app = express();

app.use(express.json());
require('dotenv').config();

const auth = require('./routes/auth');

app.use('/api/',auth);

app.listen(3000,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})