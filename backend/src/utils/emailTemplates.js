/**
 * Generates an HTML email template for password reset.
 * @param {string} resetUrl - The URL to reset the password.
 * @returns {string} The HTML content.
 */
const getPasswordResetTemplate = (resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333; text-align: center;">Reset Password Request</h2>
      <p style="color: #555; font-size: 16px;">
        You have requested to reset your password. Please click the button below to proceed:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="color: #888; font-size: 14px; text-align: center;">
        Or copy and paste this link into your browser: <br/>
        <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
      </p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `;
};

module.exports = {
  getPasswordResetTemplate,
};
