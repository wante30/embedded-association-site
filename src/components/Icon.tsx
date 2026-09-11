import type { CSSProperties } from 'react';
const paths: Record<string, string[]> = {
  cpu: ['M7 7h10v10H7z', 'M4 9h3m-3 6h3m10-6h3m-3 6h3M9 4v3m6-3v3M9 17v3m6-3v3', 'M10 10h4v4h-4z'],
  wifi: ['M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0m-9 4a5 5 0 0 1 6 0', 'M12 20h.01'],
  spark: ['m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Z', 'M20 3v4m-2-2h4'],
  robot: ['M5 9h14v11H5zM12 5v4M9 5h6M2 12v5m20-5v5', 'M8 13h.01M16 13h.01M9 17h6'],
  circuit: ['m12 3 9 9-9 9-9-9 9-9Z', 'm12 8 4 4-4 4-4-4 4-4Z', 'm4 4 2 2m12 12 2 2M4 20l2-2M18 6l2-2'],
  trophy: ['M8 3h8v8a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 15v5M8 21h8'],
  arrow: ['M5 12h14m-5-5 5 5-5 5'],
  diagonal: ['M6 18 18 6M6 6h12v12'],
  chevron: ['m9 5 7 7-7 7'],
  search: ['M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm6-2 5 5'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['m6 6 12 12M6 18 18 6'],
  moon: ['M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2'],
  github: ['M9 19c-4 1-4-2-6-2m12 5v-4a4 4 0 0 0-1-3c3 0 6-2 6-5a4 4 0 0 0-1-3 4 4 0 0 0 0-4s-1 0-4 2a13 13 0 0 0-6 0C6 3 5 3 5 3a4 4 0 0 0 0 4 4 4 0 0 0-1 3c0 3 3 5 6 5a4 4 0 0 0-1 3v4'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 1a4 4 0 0 1 0 7m5 10v-2a4 4 0 0 0-3-4'],
  user: ['M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2'],
  book: ['M3 3h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v16h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3V3Zm9 2v16'],
  layers: ['m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 17l10 5 10-5'],
  camera: ['M4 6h4l2-3h4l2 3h4v14H4V6Zm8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'],
  calendar: ['M4 5h16v16H4V5ZM8 3v4m8-4v4M4 10h16'],
  location: ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
  check: ['m5 12 4 4L19 6'],
  shield: ['m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z', 'm8 12 3 3 5-6'],
  mail: ['M3 5h18v14H3V5Zm0 0 9 8 9-8'],
  external: ['M14 3h7v7m0-7L10 14M9 3H3v18h18v-6'],
  plus: ['M12 5v14M5 12h14'],
  heart: ['M20 5c-3-3-7-1-8 2-1-3-5-5-8-2-5 5 8 16 8 16S25 10 20 5Z'],
};
export function Icon({ name = 'cpu', size = 22, className = '', style }: { name?: string; size?: number; className?: string; style?: CSSProperties }) {
  return <svg className={`icon ${className}`} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{(paths[name] || paths.cpu).map((d, i) => <path d={d} key={i} />)}</svg>;
}
