# Freight Delay Notification System

This TypeScript-based application monitors **freight delivery delays** and notifies recipients if a delay exceeds a defined threshold. It integrates:

- **Mapbox API** → Fetch real-time traffic data.
- **OpenAI GPT-4o** → Generate AI-powered delay notifications.
- **SendGrid (Email) & Twilio (SMS)** → Send notifications.

---

## Installation

### Clone the Repository

```sh
git clone https://github.com/iAnisdev/levity-ai-task
cd freight-delay-notification
```

## Install Dependencies

```sh
npm install
```

## Setup Environment Variables

Create a .env file in the root directory and add the following:

```
# Mapbox API
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
MAPBOX_URL=https://api.mapbox.com

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_URL=https://api.openai.com/v1/chat/completions

# SendGrid API (Email Notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sendgrid_email@example.com

# Twilio API (SMS Notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Before Running

Before executing the script, update index.ts to configure the recipient details for notifications.

Open src/index.ts and modify the following section:

```
let recipient: Recipient = { email: "", phone: "" }
```

Make sure to:

- Replace `recipient.email` with a valid email.
- Replace `recipient.phone` with a valid Twilio-verified phone number.

## Running the Application

To start the application, run:

```sh
npm start
```

Or manually:

```sh
npx ts-node src/index.ts
```

## Start Temporal Workflow Execution

To run the full Temporal workflow (server, worker, and workflow) in one command, run:

```sh
npm run start:temporal
```

This will:

- Load environment variables from .env.
- Start the Temporal server (start:temporal-server).
- Wait 5 seconds, then start the Temporal worker (start:temporal-worker).
- Wait another 5 seconds, then start the workflow execution (start:workflow).

## Run Temporal Components Individually

If needed, you can run each part separately:

### Start Temporal Server

```sh
npm run start:temporal-server
```

### Start Temporal Worker

```sh
npm run start:temporal-worker
```

### Start the Workflow Execution

```sh
npm run start:workflow
```
