import gsap from 'gsap';

export function slideIn(el: HTMLElement | null, delay = 0) {
  if (!el) return;
  gsap.fromTo(el,
    { opacity: 0, y: 32, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', delay, clearProps: 'transform' }
  );
}

export function fadeSlideIn(el: HTMLElement | null, delay = 0) {
  if (!el) return;
  gsap.fromTo(el,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', delay }
  );
}

export function scaleIn(el: HTMLElement | null) {
  if (!el) return;
  gsap.fromTo(el,
    { scale: 0.85, opacity: 0, y: 10 },
    { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: 'back.out(1.6)' }
  );
}

export function scaleOut(el: HTMLElement | null, onComplete: () => void) {
  if (!el) { onComplete(); return; }
  gsap.to(el, { scale: 0.88, opacity: 0, y: 8, duration: 0.2, ease: 'power2.in', onComplete });
}

export function fadeIn(el: HTMLElement | null, delay = 0) {
  if (!el) return;
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out', delay });
}

export function staggerIn(parent: HTMLElement | null, selector: string, delay = 0) {
  if (!parent) return;
  const els = parent.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;
  gsap.fromTo([...els],
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.045, delay }
  );
}

export function countUp(
  el: HTMLElement | null,
  from: number,
  to: number,
  format: (n: number) => string,
  duration = 0.7
) {
  if (!el) return;
  const proxy = { val: from };
  gsap.killTweensOf(proxy);
  gsap.to(proxy, {
    val: to,
    duration,
    ease: 'power2.out',
    onUpdate() { el.textContent = format(Math.round(proxy.val)); },
  });
}

export function flashHighlight(el: HTMLElement | null) {
  if (!el) return;
  gsap.timeline()
    .to(el, { backgroundColor: 'rgba(187,255,71,0.12)', duration: 0.15, ease: 'none' })
    .to(el, { backgroundColor: 'transparent', duration: 0.5, ease: 'power2.out' });
}

export function bouncePress(el: HTMLElement | null) {
  if (!el) return;
  gsap.timeline()
    .to(el, { scale: 0.94, duration: 0.1, ease: 'power2.in' })
    .to(el, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
}
