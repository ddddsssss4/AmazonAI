# AI-Powered E-Commerce Platform

A modern e-commerce website with voice-activated product filtering and hover-to-speak product descriptions using ElevenLabs Conversational AI.

## Features

✨ **Voice-Activated Filtering** - Say "show me t-shirts with cotton fabric under $50" and the filters apply automatically
✨ **Hover-to-Speak Product Details** - Hover over products to hear full descriptions spoken aloud
✨ **Secure Backend Integration** - API keys are never exposed to the frontend via signed URLs
✨ **Neobrutalist Design** - Bold, modern interface with no compromises on style

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Express.js, Bun, TypeScript
- **AI/Voice**: ElevenLabs Conversational AI, Text-to-Speech
- **Architecture**: Separate frontend and backend with signed URL authentication

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- ElevenLabs account with API access

### Setup ElevenLabs

1. Go to https://elevenlabs.io and create an account
2. Get your API key from https://elevenlabs.io/app/api-keys
3. Create a Conversational AI agent at https://elevenlabs.io/app/conversational-ai
4. Copy the agent ID

### Installation

#### 1. Frontend Setup

```bash
# Install dependencies
npm install
# or
bun install

# Create .env.local with backend URL
echo "VITE_BACKEND_URL=http://localhost:3001" > .env.local
```

#### 2. Backend Setup

```bash
cd server

# Install dependencies
bun install

# Create .env with ElevenLabs credentials
cp .env.example .env
# Edit .env and add your ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID
```

### Running the App

#### Terminal 1: Start the Backend Server

```bash
cd server
bun run dev
# Server runs on http://localhost:3001
```

#### Terminal 2: Start the Frontend Dev Server

```bash
npm run dev
# or
bun run dev
# Frontend runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

## How to Use

### Voice Filtering

1. Click the **"Voice Filter"** button in the sidebar
2. Press and hold the microphone button
3. Say something like: "Show me keyboards under $100" or "T-shirts with cotton fabric"
4. Release to process the command
5. Filters apply automatically

### Product Speech

1. Hover over any product card
2. Click the **speaker icon** that appears
3. The product details will be spoken aloud

## API Architecture

### Signed URL Flow

```
Client (React)
    ↓
POST /api/elevenlabs/signed-url
    ↓
Server (Express)
    ↓ (secure API key)
    ↓
ElevenLabs API
    ↓ (returns signed URL)
    ↓
Client (uses signed URL)
    ↓
ElevenLabs WebSocket/REST
```

This ensures your API keys never reach the browser.

## Environment Variables

### Frontend (.env.local)
```
VITE_BACKEND_URL=http://localhost:3001
```

### Backend (server/.env)
```
ELEVENLABS_API_KEY=your_api_key
ELEVENLABS_AGENT_ID=your_agent_id
PORT=3001
NODE_ENV=development
```

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── VoiceFilterButton.tsx       # Voice input UI
│   │   ├── ProductHoverSpeaker.tsx     # Product TTS UI
│   │   └── ...
│   ├── hooks/
│   │   ├── useElevenLabsAgent.ts       # Voice filtering hook
│   │   ├── useTextToSpeech.ts          # TTS hook
│   │   └── ...
│   ├── pages/
│   │   ├── Shop.tsx                    # Main shop page
│   │   └── ...
│   └── ...
├── server/
│   ├── src/
│   │   └── index.ts                    # Express server
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── ...
```

## Troubleshooting

### "Failed to get signed URL from ElevenLabs"
- Check that your `ELEVENLABS_API_KEY` is correct
- Verify your `ELEVENLABS_AGENT_ID` exists
- Make sure the backend server is running on port 3001

### "CORS error" or "Failed to connect to backend"
- Ensure the backend is running: `cd server && bun run dev`
- Check that `VITE_BACKEND_URL` is set correctly in `.env.local`
- Verify the Vite proxy is configured (see vite.config.ts)

### No audio playing
- Check browser microphone permissions
- Verify your ElevenLabs account has quota remaining
- Check browser console for error messages

## Browser Support

- Chrome/Chromium 90+
- Firefox 89+
- Safari 15+ (mobile may require user gesture)
- Edge 90+

Requires microphone permission and Web Audio API support.

## License

MIT
