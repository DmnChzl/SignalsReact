import Signal from 'lib';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Signal Polyfill', () => {
  const count = new Signal.State(0);
  const xCount = new Signal.Computed(() => count.get() * 2);

  beforeEach(() => {
    count.set(0);
  });

  it("should update the 'count' signal value", () => {
    expect(count.get()).toEqual(0);
    count.set(42);
    expect(count.get()).toEqual(42);
  });

  it("should update the 'xCount' computed signal value", () => {
    expect(xCount.get()).toEqual(0);
    count.set(21);
    expect(xCount.get()).toEqual(42);
  });
});
