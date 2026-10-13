import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publicRoutes, writeRouteEntries } from '../scripts/prepare-pages.mjs';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const pages = await readJson('../src/content/routes.json');
const content = await readJson('../src/content/site.json');

test('every public page and content detail has a static entry with base-aware assets', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'association-pages-'));
  try {
    const html = '<script src="/embedded-association-site/assets/app.js"></script>';
    await writeFile(join(directory, 'index.html'), html);
    const routes = publicRoutes(pages, content);
    assert.equal(routes.length, Object.keys(pages).length + content.projects.length + content.activities.length);
    await writeRouteEntries(directory, routes);
    for (const route of routes) assert.equal(await readFile(join(directory, route.slice(1), 'index.html'), 'utf8'), html, route);
    assert.equal(await readFile(join(directory, '404.html'), 'utf8'), html);
    await assert.rejects(readFile(join(directory, 'not-found/index.html')), { code: 'ENOENT' });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('route collection rejects unsafe slugs and duplicate entries', () => {
  for (const id of ['../escape', 'bad?query', 'bad#hash', '/absolute']) {
    assert.throws(() => publicRoutes(pages, { projects: [{ id }], activities: [] }), /safe directory paths/);
  }
  assert.throws(() => publicRoutes(pages, { projects: [{ id: 'same' }, { id: 'same' }], activities: [] }), /unique/);
});
