
const validate = (schema) => (req, res, next) => {
    const {error, value} = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true,
    });
    
    if(error) {
        // console.log(error);
        
        return res.json({
            message : 'validate false',
            details : error.details.map((d) => d.message)
        })
    }
    req.validatedData = value; 
    next();
}

module.exports = validate;