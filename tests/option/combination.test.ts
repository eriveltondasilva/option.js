import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Some.zip', () => {
  it('should return Some tuple when both options are Some', () => {
    const result = Option.some(10).zip(Option.some(20));
    expect(result.unwrap()).toEqual([10, 20]);
  });

  it('should return None when the other option is None', () => {
    const result = Option.some(10).zip(Option.none());
    expect(result.isNone()).toBe(true);
  });

  it('should preserve both values with different types', () => {
    const result = Option.some('Alice').zip(Option.some(30));
    expect(result.unwrap()).toEqual(['Alice', 30]);
  });
});

describe('None.zip', () => {
  it('should return None regardless of the other option', () => {
    expect(Option.none().zip(Option.some(99)).isNone()).toBe(true);
  });
});

describe('Some.zipWith', () => {
  it('should apply the combining function when both are Some', () => {
    const result = Option.some(10).zipWith(Option.some(20), (a, b) => a + b);
    expect(result.unwrap()).toBe(30);
  });

  it('should return None when the other option is None', () => {
    const result = Option.some(10).zipWith(Option.none(), (a, b) => a + b);
    expect(result.isNone()).toBe(true);
  });

  it('should support object construction as combining function', () => {
    const result = Option.some('Alice').zipWith(Option.some(30), (name, age) => ({ name, age }));
    expect(result.unwrap()).toEqual({ name: 'Alice', age: 30 });
  });
});

describe('None.zipWith', () => {
  it('should return None without calling the combining function', () => {
    const result = Option.none().zipWith(Option.some(99), () => 'should not run');
    expect(result.isNone()).toBe(true);
  });
});
