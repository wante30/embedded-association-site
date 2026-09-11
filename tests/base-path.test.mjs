import test from 'node:test';
import assert from 'node:assert/strict';
import { stripBasePath, withBasePath } from '../src/lib/basePath.mjs';

test('GitHub Pages project prefix is removed before route matching', () => {
  assert.equal(stripBasePath('/embedded-association-site/', '/embedded-association-site/'), '/');
  assert.equal(stripBasePath('/embedded-association-site/projects', '/embedded-association-site/'), '/projects');
  assert.equal(stripBasePath('/embedded-association-site/projects/demo', '/embedded-association-site/'), '/projects/demo');
});

test('internal links receive the GitHub Pages project prefix', () => {
  assert.equal(withBasePath('/', '/embedded-association-site/'), '/embedded-association-site/');
  assert.equal(withBasePath('/projects', '/embedded-association-site/'), '/embedded-association-site/projects');
  assert.equal(withBasePath('/projects/demo?from=home', '/embedded-association-site/'), '/embedded-association-site/projects/demo?from=home');
});

test('root-hosted deployments keep their original paths', () => {
  assert.equal(stripBasePath('/projects', '/'), '/projects');
  assert.equal(withBasePath('/projects', '/'), '/projects');
});
