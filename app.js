
const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();

const auth = require('./routes/auth');

app.use('/api/',auth);

app.listen(3001, ()=>{
    console.log("server runing on port 3001");
    
})
