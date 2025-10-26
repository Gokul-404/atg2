const emailService = require('../utils/emailService');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Lambda handler for sending emails via Brevo API
 * @param {Object} event - API Gateway event object
 * @returns {Object} - HTTP response object
 */
exports.handler = async (event) => {
  try {
    // Check if environment variables are configured
    if (!process.env.BREVO_API_KEY) {
      return {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: ERROR_MESSAGES.BREVO_API_KEY_MISSING,
        }),
      };
    }

    if (!process.env.SENDER_EMAIL) {
      return {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: ERROR_MESSAGES.SENDER_EMAIL_MISSING,
        }),
      };
    }

    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid JSON in request body',
        }),
      };
    }

    const { receiver_email, subject, body_text } = body;

    // Validate required fields
    if (!receiver_email || !subject || !body_text) {
      return {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: ERROR_MESSAGES.MISSING_FIELDS,
        }),
      };
    }

    // Validate email format
    if (!emailService.validateEmail(receiver_email)) {
      return {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: ERROR_MESSAGES.INVALID_EMAIL,
        }),
      };
    }

    // Send email via Brevo
    const response = await emailService.sendEmail(receiver_email, subject, body_text);

    return {
      statusCode: HTTP_STATUS.OK,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_SENT,
        data: {
          messageId: response.messageId,
        },
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);

    // Handle specific Brevo API errors
    let errorMessage = ERROR_MESSAGES.EMAIL_SEND_FAILED;
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

    if (error.response) {
      // Brevo API returned an error response
      errorMessage = error.response.text || error.response.body || errorMessage;
      statusCode = error.response.status || statusCode;
    }

    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};
