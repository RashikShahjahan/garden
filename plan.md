# Verdant Full App Implementation Plan

## Principles

Each feature ships as a vertical slice: schema, server actions/API, UI, loading/error states, and tests.

The app will use:

- Drizzle with Postgres
- OpenRouter for the AI assistant
- S3-compatible storage for photos
- Auth.js
- App Router URLs

Until Auth.js is implemented, the active garden is resolved from a secure cookie. Data access should go through a shared `getCurrentGarden()` helper so ownership can later move to Auth.js sessions.


## Feature Plan

| Order | Feature | User Outcome | Implementation Scope |
|---:|---|---|---|
| 1 | Create My Garden | User creates a persistent garden without signing in. | Add Drizzle, Postgres config, `gardens`, active garden cookie, `/onboarding`, root redirect, basic tests. |
| 2 | Add First Growing Area | User adds their first real garden area. | Add `garden_areas`, onboarding area step, server action, validation, activity event. |
| 3 | Add First Planting | User finishes onboarding with one real planting. | Add `plantings`, planting onboarding step, `/garden` redirect, garden summary from DB, setup activity event. |
| 4 | Assistant Chat | User can ask Verdant real questions early. | Add `/assistant`, `/assistant/[conversationId]`, `conversations`, `messages`, OpenRouter streaming route, persisted threads. |
| 5 | Assistant Garden Context | Assistant answers using the user's garden data. | Retrieve garden, areas, plantings, and activity; build prompt context; persist `message_sources`; show source disclosure. |
| 6 | Assistant Photo Identification | User can ask the assistant to identify a plant from a photo. | Add S3 presigned upload, `media`, message media attachments, OpenRouter multimodal input, assistant candidate response, confirm-to-create/update planting. |
| 7 | Garden Overview | User can browse their real garden. | Implement `/garden`, area filters, planting cards, counts, empty states, server-loaded data. |
| 8 | Add Planting From Garden | User can add more plantings outside onboarding. | Implement `/garden/add`, area selection or creation, manual fields, optional assistant handoff, activity event. |
| 9 | Area Detail | User can inspect and maintain an area. | Implement `/garden/areas/[areaId]`, area details, plantings in area, edit/archive actions. |
| 10 | Planting Detail | User can inspect and maintain a planting. | Implement `/garden/plantings/[plantingId]`, edit basics, attach photos, ask assistant about this planting. |
| 11 | Activity Timeline | User sees durable garden history. | Add `/activity`, `activity_events`, filters, generated events from setup, plant edits, photos, assistant-confirmed changes. |
| 12 | Today Briefing | User gets a daily garden dashboard. | Add weather fetch/cache, `weather_snapshots`, `/today`, briefing, next action, follow-ups from garden data. |
| 13 | Care Tasks | User can complete, defer, or create care tasks. | Add `tasks`, task actions, task status updates, activity events, Today refresh after changes. |
| 14 | Suggested Garden Walk | User gets a generated route of useful checks. | Add `/walks`, `walks`, `walk_items`, route generation from tasks, weather, and plantings. |
| 15 | Guided Garden Walk | User completes, skips, or flags checks. | Add `/walks/[walkId]`, persisted item status, progress UI, "something changed" assistant handoff. |
| 16 | Walk Summary | User gets a saved walk outcome. | Add `/walks/[walkId]/summary`, activity events, task updates, next-walk recommendation. |
| 17 | Auth + Accounts | User can sign in and keep their garden across devices. | Add Auth.js, Drizzle adapter, auth tables, sign-in/sign-out, session ownership, migrate cookie garden to user account. |
| 18 | Remove Prototype Mode | App no longer has demo or fixture-only behavior. | Remove `/demo`, remove fixture dependency from product flows, update README/tests, ensure all routes use persisted data. |

## Route Plan

| URL | Purpose |
|---|---|
| `/` | Redirect to `/today`, `/onboarding`, or sign-in depending on app state. |
| `/onboarding` | First garden setup. |
| `/today` | Daily dashboard. |
| `/garden` | Garden overview. |
| `/garden/add` | Add planting. |
| `/garden/areas/[areaId]` | Area detail. |
| `/garden/plantings/[plantingId]` | Planting detail. |
| `/assistant` | Assistant conversation index or new chat. |
| `/assistant/[conversationId]` | Assistant chat thread. |
| `/activity` | Garden activity timeline. |
| `/walks` | Walk list or current suggested walk. |
| `/walks/[walkId]` | Guided walk. |
| `/walks/[walkId]/summary` | Walk result summary. |
| `/signin` | Auth.js sign-in page, added near the end. |

## Schema Plan

| Area | Tables |
|---|---|
| Garden | `gardens`, `garden_areas`, `plantings` |
| Assistant | `conversations`, `messages`, `message_sources`, `message_media` |
| Media | `media` |
| Activity | `activity_events` |
| Weather | `weather_snapshots` |
| Tasks | `tasks` |
| Walks | `walks`, `walk_items` |
| Auth | `users`, `accounts`, `sessions`, `verification_tokens` |

No `plant_identifications` table.

## Acceptance Criteria

- Reloading preserves garden data, assistant threads, messages, media, activity, tasks, and walks.
- Product routes are real URLs, not client-side screen states.
- Assistant responses stream from OpenRouter and persist.
- Photo uploads use S3 presigned URLs.
- `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` pass.
