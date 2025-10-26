module.exports = {
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },

  ERROR_MESSAGES: {
    MISSING_FIELDS: 'Missing required fields: receiver_email, subject, and body_text are required',
    INVALID_EMAIL: 'Invalid email format for receiver_email',
    EMAIL_SEND_FAILED: 'Failed to send email',
    BREVO_API_KEY_MISSING: 'Brevo API key is not configured',
    SENDER_EMAIL_MISSING: 'Sender email is not configured',
  },

  SUCCESS_MESSAGES: {
    EMAIL_SENT: 'Email sent successfully',
  },
};
