# Verdant Garden Assistant

Verdant is an interactive product prototype for beginner outdoor gardeners. It combines a weather-aware Today view, guided garden setup, contextual garden records, and a simulated garden assistant.

## Prototype modes

- `/` starts with first-run onboarding and a single planting.
- `/demo` opens an established garden with populated records, activity, conversations, and Garden Walks.

The prototype uses simulated responses and in-memory state. Reloading either route resets that experience.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for onboarding or [http://localhost:3000/demo](http://localhost:3000/demo) for the established fixture.

## Verify

```bash
npm run lint
npm run typecheck
npm test
```

## Technology

React 19, Next.js 16, TypeScript, Tailwind CSS, and custom responsive CSS.
