import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const contentPath = new URL('../src/content/site.json', import.meta.url);
test('content source exists', () => assert.ok(existsSync(contentPath), 'Structured content has not been created'));
const data = existsSync(contentPath) ? JSON.parse(readFileSync(contentPath, 'utf8')) : null;
if (data) {
  test('uses the confirmed association identity', () => {
    assert.equal(data.site.name, '单片机与嵌入式协会');
    assert.equal(data.site.school, '哈尔滨理工大学');
    assert.equal(data.site.college, '计算机科学与技术学院');
    assert.equal(data.site.founded, '2024');
    assert.equal(data.site.location, '实训楼 501');
    assert.equal(data.site.advisor, '高俊锋');
    assert.equal(data.site.preview, false);
  });
  test('six directions have unique identifiers', () => { assert.equal(data.directions.length, 6); assert.equal(new Set(data.directions.map(x => x.id)).size, 6); });
  for (const group of ['projects', 'activities', 'awards', 'members']) {
    test(`${group}: published entries are real records`, () => {
      assert.ok(data[group].length > 0);
      for (const x of data[group]) { assert.equal(x.example, false); assert.ok(x.id); }
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
  test('resource links are HTTPS', () => {
    for (const x of data.resources) assert.ok(/^https:\/\/[^\s]+$/.test(x.url), x.name);
  });
  test('signup remains disabled until a real recruitment entry exists', () => assert.equal(data.site.recruitmentUrl, ''));
  test('public structured content does not contain private phone or identity numbers', () => {
    const text = JSON.stringify(data);
    assert.doesNotMatch(text, /\b1\d{10}\b/);
    assert.doesNotMatch(text, /\b\d{17}[0-9Xx]\b/);
  });
}
