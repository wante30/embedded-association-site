const rawBase = import.meta.env.BASE_URL || '/';
const basePath = rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');

export function withBase(target: string) {
  if (!target.startsWith('/') || target.startsWith('//') || !basePath) return target;
  return target === '/' ? `${basePath}/` : `${basePath}${target}`;
}

export function withoutBase(pathname: string) {
  if (!basePath) return pathname || '/';
  if (pathname === basePath || pathname === `${basePath}/`) return '/';
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || '/';
  return pathname || '/';
}

export function assetUrl(source: string) {
  if (!source || /^(?:https?:)?\/\//.test(source) || /^(?:data|blob):/.test(source)) return source;
  return source.startsWith('/') ? withBase(source) : `${rawBase}${source}`;
}
