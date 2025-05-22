import * as AlienSignals from 'alien-signals';
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';

/**
 * Writable Signal
 *
 * @template T Type of Signal value
 */
export interface Signal<T> {
  (): T;
  (val: T | ((prev: T) => T)): void;
}

/**
 * Create a Signal
 *
 * @template T Type of Signal value
 * @param initialValue The initial value
 * @returns {Signal} Writable Signal
 *
 * @example
 * ```ts
 * const counter = createSignal(42);
 * counter(21);
 * counter(); // 21
 * ```
 */
export function createSignal<T>(initialValue: T): Signal<T> {
  return AlienSignals.signal<T>(initialValue);
}

/**
 * Create a Computed Signal
 *
 * @template T Type of Computed value
 * @param fn Function returning value
 * @returns Computed Signal
 *
 * @example
 * ```ts
 * const counter = createSignal(42);
 *
 * const isEven = createComputed(() => counter() % 2 === 0);
 * const parity = createComputed(() => isEven() ? 'Even' : 'Odd');
 * ```
 */
export function createComputed<T>(fn: () => T): () => T {
  return AlienSignals.computed(fn);
}

/**
 * Create a Signal Effect
 *
 * @param fn Function that (re)run when Signals change
 * @returns Function to stop the Effect
 *
 * @example
 * ```ts
 * const counter = createSignal(42);
 *
 * const stopEffect = createEffect(() => {
 *   console.log('Value:', counter());
 * });
 *
 * stopEffect();
 * ```
 */
export function createEffect<T>(fn: () => T): () => void {
  return AlienSignals.effect(fn);
}

/**
 * React hook to use a Writable Signal
 *
 * @param signal Writable Signal
 * @returns [value, setValue]
 *
 * @example
 * ```tsx
 * const counter = createSignal(42);
 *
 * function IncrementCounter() {
 *   const [value, setValue] = useSignal(counter);
 *   return <button onClick={() => setValue(val => val + 1)}>{value}</button>;
 * }
 * ```
 */
export function useSignal<T>(signal: Signal<T>): [T, (val: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    callback =>
      createEffect(() => {
        signal();
        callback();
      }),
    () => signal(),
    () => signal()
  );

  const setValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      if (typeof val === 'function') {
        signal((val as (prev: T) => T)(signal()));
      } else {
        signal(val);
      }
    },
    [signal]
  );

  return [value, setValue];
}

/**
 * React hook to use a Computed Signal
 *
 * @param fn Function returning value
 * @returns The value of the Signal
 *
 * @example
 * ```tsx
 * const counter = createSignal(42);
 *
 * function IncrementCounter() {
 *   const [_, setValue] = useSignal(counter);
 *   const value = useComputed(() => counter() % 2 ? 'Even' : 'Odd');
 *   return <button onClick={() => setValue(val => val + 1)}>{value}</button>;
 * }
 * ```
 */
export function useComputed<T>(fn: () => T): T {
  const computed = useMemo(() => createComputed(fn), [fn]);

  return useSyncExternalStore(
    callback =>
      createEffect(() => {
        computed();
        callback();
      }),
    () => computed(),
    () => computed()
  );
}

/**
 * React hook to use a Signal Effect
 *
 * @param fn Function that (re)run when Signals change
 *
 * @example
 * ```tsx
 * const counter = createSignal(42);
 *
 * function IncrementCounter() {
 *   const [value, setValue] = useSignal(counter);
 *
 *   useSignalEffect(() => {
 *     console.log('Value:', counter());
 *   });
 *
 *   return <button onClick={() => setValue(val => val + 1)}>{value}</button>;
 * }
 * ```
 */
export function useSignalEffect(fn: () => void | (() => void)): void {
  useEffect(() => {
    let cleanup: void | (() => void);

    const stopEffect = createEffect(() => {
      if (cleanup) cleanup();
      cleanup = fn();
    });

    return () => {
      if (cleanup) cleanup();
      stopEffect();
    };
  }, [fn]);
}
