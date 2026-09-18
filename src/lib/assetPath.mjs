import { withBasePath } from './basePath.mjs';

export function assetPath(path, baseUrl = '/') {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  return withBasePath(path, baseUrl);
}
