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
  test('practice directions have unique identifiers and valid resource categories', () => {
    assert.equal(new Set(data.directions.map(x => x.id)).size, data.directions.length);
    const categories = new Set(['全部', ...data.resources.map(resource => resource.category)]);
    for (const direction of data.directions) assert.ok(categories.has(direction.resourceCategory), direction.id);
    assert.ok(data.directions.some(direction => direction.id === 'fpga' && direction.resourceCategory === 'FPGA'));
  });
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
      const imagePath = new URL(`../public${x.image}`, import.meta.url);
      assert.ok(existsSync(imagePath), x.image);
      if (x.image.endsWith('.webp')) {
        const bytes = readFileSync(imagePath);
        assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', x.image);
        assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', x.image);
        assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, `${x.image} has a truncated WebP container`);
      }
    }
  });
  test('resource links are HTTPS', () => {
    for (const x of data.resources) assert.ok(/^https:\/\/[^\s]+$/.test(x.url), x.name);
  });
  test('competition recommendations preserve the supplied planning table and its separate scope', () => {
    const source = JSON.parse(readFileSync(new URL('../docs/review/competition-recommendations-source.json', import.meta.url), 'utf8'));
    const recommendations = data.competitionRecommendations;
    assert.deepEqual(recommendations.entries, source.entries);
    assert.equal(recommendations.version, source.edition);
    assert.equal(recommendations.entries.length, source.tableRecords);
    assert.equal(new Set(recommendations.entries.map(entry => entry.id)).size, source.tableRecords);
    for (const group of recommendations.groups) assert.equal(recommendations.entries.filter(entry => entry.priority === group.id).length, source.counts[group.id]);
    assert.match(recommendations.note, /推荐层级/);
    assert.match(recommendations.note, /当届官方通知/);
    assert.ok(recommendations.entries.every(entry => !Object.hasOwn(entry, 'award') && !Object.hasOwn(entry, 'certificate')));
  });
  test('signup remains disabled until a real recruitment entry exists', () => assert.equal(data.site.recruitmentUrl, ''));
  test('the association group QR is published with the site', () => {
    assert.ok(data.site.recruitmentQr.startsWith('/images/'));
    assert.ok(existsSync(new URL(`../public${data.site.recruitmentQr}`, import.meta.url)), data.site.recruitmentQr);
    assert.match(data.site.recruitmentQrValidUntil, /^\d{4}-\d{2}-\d{2}$/);
  });
  test('public structured content does not contain private phone or identity numbers', () => {
    const text = JSON.stringify(data);
    assert.doesNotMatch(text, /\b1\d{10}\b/);
    assert.doesNotMatch(text, /\b\d{17}[0-9Xx]\b/);
  });
  test('public awards follow the confirmed publication scope', () => {
    assert.ok(data.awards.every(award => !Object.hasOwn(award, 'advisor')));
    assert.ok(!data.awards.some(award => award.id === 'craic-ai-2026'));
    assert.ok(data.awards.every(award => ['获奖证书', '成绩截图'].includes(award.sourceLabel)));
  });
}
