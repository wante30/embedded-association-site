import { useEffect, type RefObject } from 'react';

/** Content is visible until an observer is ready; motion never gates access. */
export function useScrollReveal(root: RefObject<HTMLElement | null>, route: string) {
  useEffect(() => {
    const scope = root.current;
    if (!scope || typeof window.IntersectionObserver !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop = () => {};
    const start = () => {
      stop();
      if (preference.matches) return;
      const tracked = new Set<HTMLElement>();
      const show = (element: HTMLElement) => {
        element.removeAttribute('data-reveal-pending');
        observer.unobserve(element);
      };
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) show(entry.target as HTMLElement); });
      }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });
      const register = (element: HTMLElement) => {
        if (tracked.has(element)) return;
        tracked.add(element);
        // Keep the initial viewport readable and avoid unnecessary entrance effects.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        observer.observe(element);
        element.setAttribute('data-reveal-pending', '');
      };
      const scan = (element: HTMLElement) => {
        if (element.matches('[data-reveal]')) register(element);
        element.querySelectorAll<HTMLElement>('[data-reveal]').forEach(register);
      };
      const mutations = new MutationObserver(records => {
        for (const record of records) {
          record.removedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            for (const element of tracked) {
              if (node === element || node.contains(element)) { observer.unobserve(element); tracked.delete(element); }
            }
          });
          record.addedNodes.forEach(node => { if (node instanceof HTMLElement) scan(node); });
        }
      });
      const focus = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const element = target.closest<HTMLElement>('[data-reveal]');
        if (element) show(element);
      };
      stop = () => {
        observer.disconnect(); mutations.disconnect();
        scope.removeEventListener('focusin', focus);
        tracked.forEach(element => element.removeAttribute('data-reveal-pending'));
      };
      scan(scope);
      mutations.observe(scope, { childList: true, subtree: true });
      scope.addEventListener('focusin', focus);
    };
    start();
    preference.addEventListener('change', start);
    return () => { stop(); preference.removeEventListener('change', start); };
  }, [root, route]);
}
