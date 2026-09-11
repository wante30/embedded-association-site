import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const contentPath = new URL('../src/content/site.json', import.meta.url);
test('content source exists', () => assert.ok(existsSync(contentPath), 'Structured content has not been created'));
const data = existsSync(contentPath) ? JSON.parse(readFileSync(contentPath, 'utf8')) : null;
if (data) {
  test('uses the Chinese association identity', () => assert.equal(data.site.name, '单片机与嵌入式技术协会'));
  test('six directions have unique identifiers', () => { assert.equal(data.directions.length, 6); assert.equal(new Set(data.directions.map(x => x.id)).size, 6); });
  for (const group of ['projects', 'activities', 'awards', 'members']) {
    test(`${group}: unverified entries are visibly declared examples`, () => {
      assert.ok(data[group].length > 0);
      for (const x of data[group]) { assert.equal(x.example, true); assert.ok(x.id); }
      assert.equal(new Set(data[group].map(x => x.id)).size, data[group].length);
    });
  }
  test('content images are local and present', () => {
    for (const x of [...data.projects, ...data.activities, ...data.members, ...data.culture]) {
      if (!x.image) continue;
      assert.ok(x.image.startsWith('/images/'));
      assert.ok(existsSync(new URL(`../public${x.image}`, import.meta.url)), x.image);
    }
  });
  test('resource links are HTTPS, never fake buttons', () => {
    for (const x of data.resources) assert.ok(/^https:\/\/[^\s]+$/.test(x.url), x.name);
  });
  test('signup is not enabled without a verified URL', () => assert.equal(data.site.recruitmentUrl, ''));
  test('old invented stats have been removed', () => assert.ok(!JSON.stringify(data).includes('128+')));
}
