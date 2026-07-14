const Joi = require('joi');

const companyIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

const companySearchSchema = Joi.object({
    keyword: Joi.string().trim().min(1).required()
});

const companyCreateSchema = Joi.object({
    industry: Joi.string().trim().min(2).max(200).required(),
    logo: Joi.string().uri().allow(null, ''),
    description: Joi.string().trim().max(500).allow(null, ''),
    location: Joi.string().trim().max(200).allow(null, '')
});

module.exports = {
    companyIdSchema,
    companySearchSchema,
    companyCreateSchema
};