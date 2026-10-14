import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const content = JSON.parse(read('src/content/site.json'));
const manifest = JSON.parse(read('docs/review/certificates-manifest.json'));

test('each published award links to its reviewed public certificate copies', () => {
  assert.equal(manifest.records.length, content.awards.length);
  assert.equal(new Set(manifest.records.map(record => record.id)).size, content.awards.length);
  for (const award of content.awards) {
    const record = manifest.records.find(record => record.id === award.id);
    assert.ok(record, award.id);
    assert.deepEqual(award.certificate, {
      image: `/images/certificates/${award.id}.webp`,
      thumbnail: `/images/certificates/${award.id}-thumb.webp`,
      width: record.width, height: record.height,
    });
    assert.equal(award.certificate.image, record.image);
    assert.equal(award.certificate.thumbnail, record.thumbnail);
    assert.ok(record.masks.length > 0, award.id);
    for (const { rect } of record.masks) {
      assert.equal(rect.length, 4);
      assert.ok(rect[0] >= 0 && rect[1] >= 0 && rect[2] <= record.width && rect[3] <= record.height);
      assert.ok(rect[0] < rect[2] && rect[1] < rect[3]);
    }
  }
});

test('certificate files match reviewed hashes and contain no metadata or extra source files', () => {
  const expected = [];
  for (const record of manifest.records) {
    for (const [field, hashField] of [['image', 'sha256'], ['thumbnail', 'thumbnailSha256']]) {
      const path = record[field];
      const bytes = read(`public${path}`);
      expected.push(path.split('/').at(-1));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), record[hashField], path);
      assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', path);
      assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', path);
      assert.equal(bytes.readUInt32LE(4) + 8, bytes.length, path);
      const chunks = [];
      for (let offset = 12; offset < bytes.length;) {
        const kind = bytes.subarray(offset, offset + 4).toString('ascii');
        chunks.push(kind);
        assert.ok(['VP8 ', 'VP8L', 'VP8X', 'ALPH'].includes(kind), `${path}: unexpected ${kind} chunk`);
        const size = bytes.readUInt32LE(offset + 4);
        offset += 8 + size + (size % 2);
        assert.ok(offset <= bytes.length, path);
      }
      assert.ok(chunks.includes(field === 'image' ? 'VP8L' : 'VP8 '), path);
    }
  }
  assert.deepEqual(readdirSync(new URL('public/images/certificates/', root)).sort(), expected.sort());
});
