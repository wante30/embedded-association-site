# Reference UI redesign

Approved direction: the user's blue-and-white, eight-panel reference image, confirmed in chat. This is a complete frontend refactor on `redesign/reference-ui-v1`, based on remote master `2dc2bb314c33721c900d02168768f050e887f02e`; master must not be changed.

## Visual contract
- Dark, compact 72px header; Chinese association name is the brand, not “ME Tech Lab”.
- Full-width navy/PCB hero, cyan Chinese headline, two primary navigation actions; no HUD or fake instrumentation.
- Overlapping dark statistics strip, six compact direction cards, image-led project and activity cards.
- White about/awards/members/join layouts; dark project/activity/resource collections. Small 8–14px radii, restrained blue, strong readable Chinese typography.
- Dedicated page compositions, not the old repeated PageHero. Desktop content width 1180px. Mobile navigation below 1000px; 360/390/768/1024/1440px widths must not overflow.

## Scope and truthfulness
React + TypeScript; reusable components, plain token-based CSS, structured JSON content. Keep existing Vite and Cloudflare build compatibility. Route state is a small native-history adapter, with navigation, back and deep-link checks required in production CI; no backend added.

Every project/activity/award/member not confirmed by the user is explicitly marked as example/pending. Numbers derive from the content itself, not invented achievements. Contact and application URLs remain unset until supplied. Do not invent a form submission or publish personal information. Images derived from the user-provided conceptual reference are labeled as illustrations, never lab/event photographs.

## Acceptance
All 8 main routes, project/activity detail routes, and 404 render. Search, filters, mobile menu, keyboard dismissal, route focus, dark theme persistence, FAQ and disabled signup state work. No broken local images or browser console exceptions. Screenshot desktop and mobile pages, inspect each, revise failed layouts, then capture again. Do not claim npm build/typechecking passed unless the real command completes. The local environment cannot download npm packages; if needed use its installed React runtime for a clearly identified supplementary browser review and validate the production build independently in GitHub Actions.
