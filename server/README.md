# ElevenLabs AI Voice Server

This server handles secure communication with ElevenLabs APIs using signed URLs to protect your API credentials.

## Setup

### 1. Install Dependencies

```bash
cd server
bun install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

You need:
- **ELEVENLABS_API_KEY**: Get from https://elevenlabs.io/app/api-keys
- **ELEVENLABS_AGENT_ID**: Get from https://elevenlabs.io/app/conversational-ai (create a Conversational AI agent first)

### 3. Start the Server

```bash
bun run dev
```

The server will start on `http://localhost:3001` and proxy API requests.

## How It Works

1. **Client sends voice**: React app records audio and sends to backend
2. **Backend generates signed URL**: Server calls ElevenLabs to get a time-limited signed URL
3. **Frontend uses signed URL**: Client makes requests with the signed URL (no API key exposure)
4. **Text-to-Speech**: Product descriptions are converted to speech via the backend endpoint

## API Endpoints

- `POST /api/elevenlabs/signed-url` - Get a signed URL for the Conversational AI agent
- `POST /api/elevenlabs/tts` - Generate speech from text (application/json with `{ text, voiceId }`)
- `GET /health` - Health check

## Environment Variables

- `ELEVENLABS_API_KEY` - Your ElevenLabs API key (keep secret)
- `ELEVENLABS_AGENT_ID` - Your Conversational AI agent ID
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)
