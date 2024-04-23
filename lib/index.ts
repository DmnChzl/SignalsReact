import { Signal } from 'signal-polyfill';
import { useSyncExternalStore } from 'react';

let isSignalPending = true;

const watcher = new Signal.subtle.Watcher(() => {
  if (isSignalPending) {
    isSignalPending = false;
    queueMicrotask(pendingSignal);
  }
});

function pendingSignal() {
  isSignalPending = true;

  for (const signal of watcher.getPending()) {
    signal.get();
  }

  watcher.watch();
}

function effect(callback: () => void) {
  let cleanup!: () => void;

  const computed = new Signal.Computed(() => {
    cleanup?.();
    cleanup = (callback as () => () => void)();
  });

  watcher.watch(computed);
  computed.get();

  return () => {
    watcher.unwatch(computed);
    typeof cleanup === 'function' && cleanup();
  };
}

export function useSignal<T>(signal: Signal.State<T>): [T, (val: T) => void] {
  let value = signal.get();

  return [
    useSyncExternalStore(
      subscribe =>
        effect(() => {
          value = signal.get();
          subscribe();
        }),
      () => value,
      () => value
    ),
    val => signal.set(val)
  ];
}

export function useComputed<T>(signal: Signal.Computed<T>): T {
  let value = signal.get();

  return useSyncExternalStore(
    subscribe =>
      effect(() => {
        value = signal.get();
        subscribe();
      }),
    () => value,
    () => value
  );
}

export default Signal;
