import { createComputed, createSignal } from 'lib';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Signal', () => {
  const count = createSignal(0);
  const xCount = createComputed(() => count() * 2);

  beforeEach(() => {
    count(0);
  });

  it("should update the 'count' signal value", () => {
    expect(count()).toEqual(0);
    count(42);
    expect(count()).toEqual(42);
  });

  it("should update the 'xCount' computed signal value", () => {
    expect(xCount()).toEqual(0);
    count(21);
    expect(xCount()).toEqual(42);
  });
});
