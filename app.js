const express = require("express");
const app = express();

app.use(express.json());
require('dotenv').config();

const auth = require('./routes/auth');
const profile = require('./routes/seekers/profile');
const job = require('./routes/seekers/job');
const application = require('./routes/seekers/application');
const companyseek = require('./routes/seekers/companyseek');
const companies = require('./routes/company/companies');

app.use('/api/auth',auth);
app.use('/api/seekers',profile);
app.use('/api/jobs',job);
app.use('/api/application',application);
app.use('/api/company',companyseek);
app.use('/api/companies',companies);

app.listen(3000,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})