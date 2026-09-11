import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('router honors Vite BASE_URL for project-site hosting', () => {
  const paths = read('src/lib/paths.ts');
  const router = read('src/lib/router.tsx');
  assert.match(paths, /import\.meta\.env\.BASE_URL/);
  assert.match(paths, /export function withBase/);
  assert.match(paths, /export function withoutBase/);
  assert.match(router, /withBase/);
  assert.match(router, /withoutBase/);
});

test('dynamic public images use the base-aware asset helper', () => {
  const content = read('src/content/index.ts');
  const about = read('src/pages/About.tsx');
  assert.match(content, /assetUrl/);
  assert.match(content, /export const projects = content\.projects\.map/);
  assert.match(content, /export const activities = content\.activities\.map/);
  assert.match(content, /export const members = content\.members\.map/);
  assert.match(about, /assetUrl\('\/images\/lab-scene\.webp'\)/);
});

test('GitHub Pages deployment workflow exists with required permissions and SPA fallback', () => {
  const path = new URL('../.github/workflows/pages-preview.yml', import.meta.url);
  assert.ok(existsSync(path), 'pages-preview.yml is missing');
  const workflow = read('.github/workflows/pages-preview.yml');
  assert.match(workflow, /redesign\/reference-ui-v1/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /--base \/embedded-association-site\//);
  assert.match(workflow, /cp dist\/index\.html dist\/404\.html/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
