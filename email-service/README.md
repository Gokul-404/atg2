# Email Service - Serverless Framework with Brevo

A serverless REST API service for sending emails using Brevo (formerly Sendinblue) API.

## Project Structure

```
email-service/
├── serverless.yml          # Serverless Framework configuration
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
├── handlers/
│   └── sendEmail.js        # Lambda handler for email sending
├── utils/
│   └── emailService.js     # Brevo API integration service
└── config/
    └── constants.js        # Configuration constants
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Serverless Framework** installed globally
3. **Brevo Account** (https://www.brevo.com)

## Setup Instructions

### 1. Create a Brevo Account

1. Go to https://www.brevo.com
2. Sign up for a free account
3. Verify your email address
4. Navigate to **Settings > SMTP & API** in the Brevo dashboard
5. Create an API key and copy it
6. Verify your sender email address in Brevo

### 2. Install Dependencies

```bash
cd email-service
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your Brevo credentials:

```env
BREVO_API_KEY=your_actual_brevo_api_key
SENDER_EMAIL=your_verified_email@example.com
SENDER_NAME=Your Name
NODE_ENV=development
```

### 4. Run Serverless Offline

Start the local development server:

```bash
npm start
```

The API will be available at: `http://localhost:3000`

## API Endpoint

### POST /send-email

Sends an email to the specified recipient.

**Request:**

```bash
POST http://localhost:3000/send-email
Content-Type: application/json

{
  "receiver_email": "recipient@example.com",
  "subject": "Test Email",
  "body_text": "This is a test email sent via Brevo API."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "messageId": "<message-id-from-brevo>"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing required fields or invalid email format
  ```json
  {
    "success": false,
    "message": "Missing required fields: receiver_email, subject, and body_text are required"
  }
  ```

- **400 Bad Request** - Invalid email format
  ```json
  {
    "success": false,
    "message": "Invalid email format for receiver_email"
  }
  ```

- **500 Internal Server Error** - API key not configured or email sending failed
  ```json
  {
    "success": false,
    "message": "Brevo API key is not configured"
  }
  ```

## Testing the API

### Using cURL:

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_email": "test@example.com",
    "subject": "Hello from Serverless",
    "body_text": "This is a test email!"
  }'
```

### Using Postman:

1. Set method to POST
2. URL: `http://localhost:3000/send-email`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "receiver_email": "test@example.com",
     "subject": "Test Subject",
     "body_text": "Test email body"
   }
   ```

## Deployment

### Deploy to AWS:

```bash
npm run deploy
```

This will deploy your service to AWS Lambda and API Gateway.

### Remove deployment:

```bash
npm run remove
```

## Features

- RESTful API for sending emails
- Brevo (Sendinblue) integration
- Comprehensive error handling
- Email validation
- Environment-based configuration
- CORS enabled
- Serverless offline support for local development
- Proper HTTP status codes

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- Invalid email format
- Missing API credentials
- Brevo API errors
- JSON parsing errors

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| BREVO_API_KEY | Your Brevo API key | Yes |
| SENDER_EMAIL | Verified sender email address | Yes |
| SENDER_NAME | Name displayed as sender | No |
| NODE_ENV | Environment (development/production) | No |

## Troubleshooting

1. **"Brevo API key is not configured"**
   - Ensure your `.env` file exists and contains `BREVO_API_KEY`

2. **"Sender email is not configured"**
   - Add `SENDER_EMAIL` to your `.env` file
   - Verify the email address in your Brevo account

3. **Email not sending**
   - Check your Brevo account daily sending limits
   - Verify the sender email is verified in Brevo
   - Check the receiver email is not blacklisted

## License

ISC
