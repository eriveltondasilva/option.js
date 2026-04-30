import { describe, expect, it } from 'vitest';

import { none, Option, some } from '@/.';

describe('Option.some', () => {
  it('should wrap a primitive value in Some', () => {
    const result = Option.some(42);
    expect(result.unwrap()).toBe(42);
  });

  it('should wrap an object value in Some', () => {
    const obj = { name: 'Alice', age: 30 };
    const result = Option.some(obj);
    expect(result.unwrap()).toEqual(obj);
  });

  it('should wrap null explicitly in Some', () => {
    const result = Option.some(null);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBeNull();
  });

  it('should wrap undefined explicitly in Some', () => {
    const result = Option.some(undefined);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBeUndefined();
  });

  it('should be accessible via named export', () => {
    expect(some(10).unwrap()).toBe(10);
  });
});

describe('Option.none', () => {
  it('should return a None value', () => {
    const result = Option.none();
    expect(result.isNone()).toBe(true);
  });

  it('should always return the same singleton', () => {
    expect(Option.none()).toBe(Option.none());
  });

  it('should be accessible via named export', () => {
    expect(none().isNone()).toBe(true);
  });
});

describe('Option.fromNullable', () => {
  it('should return Some when value is a number', () => {
    const result = Option.fromNullable(42);
    expect(result.unwrap()).toBe(42);
  });

  it('should return Some when value is an empty string', () => {
    const result = Option.fromNullable('');
    expect(result.unwrap()).toBe('');
  });

  it('should return Some when value is false', () => {
    const result = Option.fromNullable(false);
    expect(result.unwrap()).toBe(false);
  });

  it('should return Some when value is zero', () => {
    const result = Option.fromNullable(0);
    expect(result.unwrap()).toBe(0);
  });

  it('should return None when value is null', () => {
    expect(Option.fromNullable(null).isNone()).toBe(true);
  });

  it('should return None when value is undefined', () => {
    expect(Option.fromNullable(undefined).isNone()).toBe(true);
  });
});

describe('Option.fromTry', () => {
  it('should return Some with the function return value on success', () => {
    const result = Option.fromTry(() => JSON.parse('{"x":1}'));
    expect(result.unwrap()).toEqual({ x: 1 });
  });

  it('should return None when the function throws', () => {
    const result = Option.fromTry(() => JSON.parse('invalid json'));
    expect(result.isNone()).toBe(true);
  });

  it('should return None when the function throws a custom error', () => {
    const result = Option.fromTry(() => {
      throw new RangeError('out of range');
    });
    expect(result.isNone()).toBe(true);
  });
});

describe('Option.validate', () => {
  it('should return Some when predicate is satisfied', () => {
    const result = Option.validate(42, (v) => v > 10);
    expect(result.unwrap()).toBe(42);
  });

  it('should return None when predicate is not satisfied', () => {
    const result = Option.validate(5, (v) => v > 10);
    expect(result.isNone()).toBe(true);
  });

  it('should preserve the original value when Some', () => {
    const obj = { score: 99 };
    const result = Option.validate(obj, (v) => v.score > 50);
    expect(result.unwrap()).toBe(obj);
  });
});
