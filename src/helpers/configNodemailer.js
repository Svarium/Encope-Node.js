// config/nodemailer.js

require("dotenv").config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu dirección de correo electrónico de Gmail
        pass: process.env.EMAIL_PASSWORD // Tu contraseña de Gmail
    }
});

module.exports = transporter;