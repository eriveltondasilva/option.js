import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Option.fromPromise', () => {
  it('should return Some when the promise resolves', async () => {
    const result = await Option.fromPromise(async () => 42);
    expect(result.unwrap()).toBe(42);
  });

  it('should return Some with an object when the promise resolves with one', async () => {
    const result = await Option.fromPromise(async () => ({ id: 1, name: 'Alice' }));
    expect(result.unwrap()).toEqual({ id: 1, name: 'Alice' });
  });

  it('should return None when the promise rejects', async () => {
    const result = await Option.fromPromise(async () => {
      throw new Error('network error');
    });
    expect(result.isNone()).toBe(true);
  });

  it('should return None when the promise rejects with any error type', async () => {
    const result = await Option.fromPromise(() => Promise.reject(new TypeError('bad type')));
    expect(result.isNone()).toBe(true);
  });

  it('should allow chaining after resolution', async () => {
    const result = await Option.fromPromise(async () => 10);
    const mapped = result.map((v) => v * 2).unwrapOr(0);
    expect(mapped).toBe(20);
  });
});
