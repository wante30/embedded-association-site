import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(read('src/content/site.json'));
test('projects and members expose replaceable image fields', () => {
  for (const group of ['projects', 'members']) for (const entry of data[group]) assert.equal(typeof entry.image, 'string', entry.id);
});
test('router subscribes to query changes as well as pathname', () => {
  const router = read('src/lib/router.tsx');
  assert.match(router, /const snapshot[^;]*location\.search/);
});

test('runtime media paths respect the deployment base path', async () => {
  const { assetPath } = await import('../src/lib/assetPath.mjs');
  assert.equal(assetPath('/images/demo.webp', '/embedded-association-site/'), '/embedded-association-site/images/demo.webp');
  assert.equal(assetPath('/images/demo.webp', '/'), '/images/demo.webp');
  assert.equal(assetPath('https://example.com/demo.webp', '/embedded-association-site/'), 'https://example.com/demo.webp');
  assert.match(read('src/components/Art.tsx'), /assetPath\(image/);
  assert.match(read('src/components/Cards.tsx'), /assetPath\(m\.image/);
  assert.match(read('src/pages/About.tsx'), /assetPath\('\/images\/association-group-2024\.webp'/);
});
