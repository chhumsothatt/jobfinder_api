// Add this function
const transporter = require('../configs/mailer');

const sendVerificationEmail = async (to,token) => {
    try {
        const verificationLink = `http://localhost:3000/api/verifyemail=${token}`;
        
        const mailOptions = {
            from: `"Job Finder" <${process.env.MAIL_AUTH_USER}>`,
            to,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">Welcome to Job Finder!</h2>
                    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="token = ${verificationLink}" 
                           style="background-color: #007bff; 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all; border-radius: 3px;">
                        ${verificationLink}
                    </p>
                    <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent to:', to);
        console.log('📧 Message ID:', info.messageId);
        return info;
        
    } catch (error) {
        console.error('❌ Error sending verification email:', error.message);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

module.exports = {sendVerificationEmail};