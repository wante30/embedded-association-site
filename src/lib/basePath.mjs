function normalizeBase(baseUrl) {
  let base = typeof baseUrl === 'string' && baseUrl ? baseUrl : '/';
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return base.replace(/\/{2,}/g, '/');
}

export function stripBasePath(pathname, baseUrl) {
  const path = pathname || '/';
  const base = normalizeBase(baseUrl);
  if (base === '/') return path;
  const baseRoot = base.slice(0, -1);
  if (path === baseRoot || path === base) return '/';
  if (path.startsWith(base)) return `/${path.slice(base.length)}`.replace(/\/{2,}/g, '/');
  return path;
}

export function withBasePath(to, baseUrl) {
  if (!to.startsWith('/')) return to;
  const base = normalizeBase(baseUrl);
  if (base === '/') return to;
  const baseRoot = base.slice(0, -1);
  if (to === baseRoot || to.startsWith(base)) return to;
  if (to === '/') return base;
  return `${baseRoot}${to}`;
}
