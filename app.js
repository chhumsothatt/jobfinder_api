const express = require("express");
const app = express();
const port = 3000;

app.get('/',(req,res)=>{
    console.log(req.query);
    console.log("Hello world");

    res.send("<h1>Job Finder API</h1><p>Welcome to Job Finder API</p>")
    
})
app.post('/register/:id', (req, res) => {
    console.log("Hello world");
    console.log(req.params.id); // Access the ID parameter
    res.send("<h1>Job Finder API</h1><p>Welcome to Job Finder API</p>");
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
    
})