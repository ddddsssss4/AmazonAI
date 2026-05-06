import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!apiKey || !agentId) {
      console.error('[v0] Missing ElevenLabs configuration');
      return res.status(500).json({
        error: 'Missing ElevenLabs configuration',
        details: 'ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID not set',
      });
    }

    console.log('[v0] Generating signed URL for agent:', agentId);

    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!signedUrlResponse.ok) {
      const errorData = await signedUrlResponse.text();
      console.error('[v0] ElevenLabs signed URL error:', errorData);
      return res.status(signedUrlResponse.status).json({
        error: 'Failed to get signed URL from ElevenLabs',
        details: errorData,
      });
    }

    const data = await signedUrlResponse.json();
    console.log('[v0] Signed URL generated successfully');

    return res.json({
      signedUrl: data.signed_url,
      agentId,
    });
  } catch (error) {
    console.error('[v0] Signed URL server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
