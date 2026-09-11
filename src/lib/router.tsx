import { useSyncExternalStore } from 'react';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { withBase, withoutBase } from './paths';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}
const snapshot = () => `${window.location.pathname}${window.location.search}`;
export function usePath() {
  const location = useSyncExternalStore(subscribe, snapshot, () => '/');
  const pathname = withoutBase(location.split('?')[0]);
  return pathname.replace(/\/$/, '') || '/';
}
export function Link({ to, onClick, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const href = withBase(to);
  function follow(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || props.download !== undefined) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || url.hash) return;
    event.preventDefault();
    if (`${url.pathname}${url.search}` === `${window.location.pathname}${window.location.search}`) { window.scrollTo(0, 0); return; }
    window.history.pushState(null, '', `${url.pathname}${url.search}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  return <a href={href} onClick={follow} {...props}>{children}</a>;
}
