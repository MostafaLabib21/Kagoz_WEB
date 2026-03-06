const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"Kagoz" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Kagoz account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 8px;">Hello ${name},</h2>
        <p style="color: #374151; font-size: 16px;">Your verification code</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827; background: #f3f4f6; padding: 16px 32px; border-radius: 8px;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>15 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't create an account on Kagoz, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; Kagoz — Your E-Commerce Destination</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
