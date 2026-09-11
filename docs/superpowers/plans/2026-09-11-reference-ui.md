# Reference UI Implementation Plan

> Execution: inline; approved by the user's request to implement and visually verify the reference design.

**Goal:** replace the prototype with a complete, responsive reference-led association frontend.
**Architecture:** JSON content → typed content adapter → React page modules/shared cards → native history adapter; token CSS; static Vite output.
**Tech Stack:** React, TypeScript, Vite, CSS, Node built-in tests, Python Playwright for screenshot review.
**Spec:** ../specs/2026-09-11-reference-ui-design.md

## Global constraints
Do not update master. No fabricated achievements or real-person portraits. No external runtime font/image requests. No backend or fake submission. Never put font files in deliverables.

## Tasks
- [x] 1. Write failing content tests (`tests/content.test.mjs`), checking exact site name, explicit sample markers, unique slugs, local image existence and HTTPS resource links. Run `node --test tests/content.test.mjs`, confirm failure before content exists.
- [x] 2. Implement `src/content/site.json`, typed adapter and local illustration assets. Repeat content tests until green.
- [x] 3. Implement layout, accessible navigation, icon/card/art primitives, theme and router (`src/components`, `src/lib`, `src/styles`).
- [x] 4. Implement all main/detail/not-found pages (`src/pages`) against the approved compositions. Never duplicate a generic oversized hero across pages.
- [x] 5. Run browser tests (`tests/visual_review.py`) at 1440/390 and layout probes at 360/768/1024/1920; test filters, search, theme, FAQ, menu, navigation and errors.
- [x] 6. Open every resulting desktop/mobile screenshot. Log specific defects in `docs/review/acceptance.md`; fix code and re-capture affected routes.
- [ ] 7. Commit files through GitHub's tree/commit APIs, run real `npm ci`, `npm test`, `npm run build` in CI and inspect logs. Read branch and master heads afterward to verify exact delivery and master preservation.
- [ ] 8. Provide source, screenshots, review evidence and branch/PR links. Clearly distinguish browser checks, automated checks and any unverified production deployment.

Local component-fixture evidence is complete; native production checks and remote delivery remain separately gated by CI.
