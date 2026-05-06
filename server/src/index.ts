import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from server directory first, then fallback to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try server/.env first
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Then try project root .env (will only load vars not already set)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = 3001;

// Environment variables
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

// Middleware - allow all origins (dev server)
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate signed URL for ElevenLabs Conversational AI agent
app.post('/api/elevenlabs/signed-url', async (req, res) => {
  try {
    if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
      return res.status(500).json({
        error: 'Missing ElevenLabs configuration',
        details: 'ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID not set'
      });
    }

    console.log('[v0] Generating signed URL for agent:', ELEVENLABS_AGENT_ID);

    // ElevenLabs Conversational AI signed URL endpoint
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      }
    );

    if (!signedUrlResponse.ok) {
      const errorData = await signedUrlResponse.text();
      console.error('[v0] ElevenLabs error:', errorData);
      return res.status(signedUrlResponse.status).json({
        error: 'Failed to get signed URL from ElevenLabs',
        details: errorData
      });
    }

    const data = await signedUrlResponse.json();
    console.log('[v0] Signed URL generated successfully');

    res.json({
      signedUrl: data.signed_url,
      agentId: ELEVENLABS_AGENT_ID
    });
  } catch (error) {
    console.error('[v0] Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Text-to-speech endpoint
app.post('/api/elevenlabs/tts', async (req, res) => {
  try {
    const { text, voiceId = 'cgSgspJ2msn5ssLCgxWa' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY not set' });
    }

    console.log('[v0] Generating TTS for text:', text.substring(0, 50) + '...');

    const ttsResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.text();
      console.error('[v0] TTS error:', errorData);
      return res.status(ttsResponse.status).json({
        error: 'Failed to generate speech',
        details: errorData
      });
    }

    // Get audio buffer
    const audioBuffer = await ttsResponse.arrayBuffer();

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);

    // Send audio buffer
    res.send(Buffer.from(audioBuffer));

    console.log('[v0] TTS generated successfully');
  } catch (error) {
    console.error('[v0] Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[v0] ElevenLabs server running on http://localhost:${PORT}`);
  console.log(`[v0] Agent ID: ${ELEVENLABS_AGENT_ID}`);
  console.log(`[v0] API Key configured: ${ELEVENLABS_API_KEY ? 'yes' : 'no'}`);
});
