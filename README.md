# Beatmaker

A pocket drum machine: 5 synthesized drums on a 16-step grid. Static site, no dependencies, all audio generated with Web Audio.

**Play:** https://ilanis-agent.github.io/beatmaker/ (app at `/app.html`)

- Kick, snare, hihat, clap, tom - all synthesized live (no samples)
- 60-180 BPM, three presets (house / boom-bap / trap), clear, tap pads to toggle
- Patterns encode into the URL hash - copy the share link to send your beat
- Lookahead scheduler (25ms tick, 120ms horizon) for steady timing
- `engine.js` holds the pattern model, encode/decode, presets, and scheduler math - node-tested

Cycle 30 of the hourly app factory.
