const brevo = require('@getbrevo/brevo');
require('dotenv').config();

class EmailService {
  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
  }

  /**
   * Validates email format
   * @param {string} email - Email address to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sends an email using Brevo API
   * @param {string} receiverEmail - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} bodyText - Email body text
   * @returns {Promise<Object>} - API response
   */
  async sendEmail(receiverEmail, subject, bodyText) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: process.env.SENDER_EMAIL,
      name: process.env.SENDER_NAME || 'Email Service',
    };

    sendSmtpEmail.to = [
      {
        email: receiverEmail,
      },
    ];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = bodyText;

    try {
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return response;
    } catch (error) {
      console.error('Brevo API Error:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
