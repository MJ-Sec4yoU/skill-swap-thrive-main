const nodemailer = require('nodemailer');

let transporter;

const initializeEmailTransporter = () => {
    try {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: process.env.NODE_ENV === 'production'
            }
        });

        // Verify connection
        transporter.verify((error) => {
            if (error) {
                console.error('Email service error:', error);
            } else {
                console.log('✉️ Email service is ready');
            }
        });
    } catch (error) {
        console.error('Failed to initialize email service:', error);
        throw error;
    }
};

const getTransporter = () => {
    if (!transporter) {
        initializeEmailTransporter();
    }
    return transporter;
};

module.exports = {
    initializeEmailTransporter,
    getTransporter
};