# Verdant Garden Assistant

Verdant is an interactive product prototype for beginner outdoor gardeners. It combines a weather-aware Today view, guided garden setup, contextual garden records, and an AI assistant designed around a small mixed garden.

## Live prototype

[Open the current prototype](https://verdant-garden-assistant.rashiksh.chatgpt.site)

## Prototype highlights

- Fresh-start onboarding for location, first garden area, and first planting
- AI-assisted plant identification with confirmation before saving
- Beginner-friendly Today view with plain-language next steps
- Garden areas for containers, raised beds, and in-ground plantings
- Separate user-created assistant conversations
- Automatic garden Activity history
- Responsive desktop and mobile layouts

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

The prototype uses simulated AI responses and in-memory state. Reloading returns to the first-run experience.

## Technology

React 19, Next.js 16, Vinext, Vite, TypeScript, and Cloudflare-compatible Workers.
