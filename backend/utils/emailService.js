const { getTransporter } = require('./emailConfig');

const emailTemplates = {
    verifyEmail: (token, userName) => ({
        subject: 'Welcome to Skill Swap - Verify Your Email',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                    .content { padding: 20px; background-color: #f9fafb; border-radius: 5px; margin: 20px 0; }
                    .button { background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                    .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Skill Swap!</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${userName},</h2>
                        <p>Thank you for joining Skill Swap! To start exchanging skills and knowledge, please verify your email address.</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" class="button">Verify Email</a>
                        </p>
                        <p>This link will expire in 24 hours.</p>
                        <p>If you didn't create an account with us, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Skill Swap. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    resetPassword: (token, userName) => ({
        subject: 'Reset Your Password - Skill Swap',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                    .content { padding: 20px; background-color: #f9fafb; border-radius: 5px; margin: 20px 0; }
                    .button { background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                    .warning { color: #DC2626; margin: 20px 0; }
                    .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${userName},</h2>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}" class="button">Reset Password</a>
                        </p>
                        <p>This link will expire in 1 hour.</p>
                        <p class="warning">If you didn't request this password reset, please contact our support team immediately.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Skill Swap. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    passwordChanged: (userName) => ({
        subject: 'Password Changed Successfully - Skill Swap',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                    .content { padding: 20px; background-color: #f9fafb; border-radius: 5px; margin: 20px 0; }
                    .success { color: #059669; margin: 20px 0; }
                    .warning { color: #DC2626; margin: 20px 0; }
                    .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Changed</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${userName},</h2>
                        <p class="success">Your password has been successfully changed.</p>
                        <p class="warning">If you didn't make this change, please:</p>
                        <ol>
                            <li>Change your password immediately</li>
                            <li>Contact our support team</li>
                            <li>Review your account activity</li>
                        </ol>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Skill Swap. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    })
};

const sendEmail = async ({ to, template, data }) => {
    try {
        const transporter = getTransporter();
        const emailContent = emailTemplates[template](data.token, data.userName);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: emailContent.subject,
            html: emailContent.html,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High'
            }
        });

        console.log('📧 Email sent successfully:', {
            messageId: info.messageId,
            template,
            to: to.substring(0, 3) + '...@' + to.split('@')[1] // Log partial email for privacy
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw {
            message: 'Failed to send email',
            error: error.message,
            template,
            to: to.substring(0, 3) + '...@' + to.split('@')[1]
        };
    }
};

module.exports = {
    sendEmail,
    emailTemplates
};