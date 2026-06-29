const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    serivce: process.env.MIAL_SEVICE,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.MAIL_AUTH_PASSWORD
    }
})

module.exports = transporter;