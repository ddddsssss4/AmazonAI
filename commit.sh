#!/bin/bash
cd /vercel/share/v0-project
git add -A
git commit -m "feat: Add conversational AI voice agent with ElevenLabs integration

- Implement ElevenLabs client tools for voice filtering, cart, and navigation
- Add TTS for product descriptions with Mark voice (UgBBYS2sOqTuMpoF3BR0)
- Create voice-powered filter application system with 9 filter parameters
- Update Shop and Product pages with voice command support and back buttons
- Add speaker button to all product cards for audio descriptions
- Update useElevenLabsAgent hook with 5 client tools (applyFilters, clearFilters, addToCart, getProductDetails, navigateToProduct)
- Add ElevenLabs tools configuration JSON for dashboard setup
- Fix product data array syntax error
- Update server with dotenv configuration and eleven_turbo_v2_5 model"
git push origin main
