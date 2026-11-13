// Owned resources for a lab enhancement; safe to dispose and initialize again.
export function createLabScope() {
  const controller = new AbortController();
  const frames = new Set<number>();
  const timers = new Set<number>();
  const observers = new Set<{ disconnect(): void }>();
  const animations = new Set<Animation>();
  const cleanups = new Set<() => void>();
  let disposed = false;
  const scope = {
    get disposed() { return disposed; },
    listen<K extends keyof GlobalEventHandlersEventMap>(target: EventTarget, type: K | (string & {}), callback: (event: GlobalEventHandlersEventMap[K]) => void, options: AddEventListenerOptions = {}) {
      target.addEventListener(type, callback as EventListener, { ...options, signal: controller.signal });
    },
    frame(callback: FrameRequestCallback) {
      if (disposed) return 0;
      const id = requestAnimationFrame(time => { frames.delete(id); if (!disposed) callback(time); });
      frames.add(id); return id;
    },
    delay(callback: () => void, time: number) {
      if (disposed) return 0;
      const id = window.setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, time);
      timers.add(id); return id;
    },
    cancelDelay(id: number | undefined) { if (id !== undefined) { clearTimeout(id); timers.delete(id); } },
    observe<T extends { disconnect(): void }>(observer: T): T { observers.add(observer); return observer; },
    animate(target: Element, frames: Keyframe[], options: KeyframeAnimationOptions) {
      const animation = target.animate(frames, options);
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      return animation;
    },
    onDispose(callback: () => void) { cleanups.add(callback); },
    cancelAnimations() { animations.forEach(a => a.cancel()); animations.clear(); },
    dispose() {
      if (disposed) return;
      disposed = true; controller.abort();
      frames.forEach(cancelAnimationFrame); frames.clear();
      timers.forEach(clearTimeout); timers.clear();
      observers.forEach(o => o.disconnect()); observers.clear();
      animations.forEach(a => a.cancel()); animations.clear();
      cleanups.forEach(fn => fn()); cleanups.clear();
    },
  };
  document.addEventListener("astro:before-swap", () => scope.dispose(), { once: true, signal: controller.signal });
  window.addEventListener("pagehide", event => { if (!event.persisted) scope.dispose(); }, { signal: controller.signal });
  return scope;
}
