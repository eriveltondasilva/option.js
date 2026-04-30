import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Option.all', () => {
  it('should return Some with all values when every option is Some', () => {
    const result = Option.all([Option.some(1), Option.some(2), Option.some(3)]);
    expect(result.unwrap()).toEqual([1, 2, 3]);
  });

  it('should return Some with an empty array when given an empty array', () => {
    const result = Option.all([]);
    expect(result.unwrap()).toEqual([]);
  });

  it('should return None when any option in the array is None', () => {
    const result = Option.all([Option.some(1), Option.none(), Option.some(3)]);
    expect(result.isNone()).toBe(true);
  });

  it('should return None on the first None encountered', () => {
    const result = Option.all([Option.none(), Option.some(2)]);
    expect(result.isNone()).toBe(true);
  });

  it('should throw ResultTypeError when a non-Option value is in the array', () => {
    expect(() => Option.all(['non-option' as never])).toThrow();
  });
});

describe('Option.collect', () => {
  it('should behave identically to all when all options are Some', () => {
    const result = Option.collect([Option.some('a'), Option.some('b')]);
    expect(result.unwrap()).toEqual(['a', 'b']);
  });

  it('should behave identically to all when any option is None', () => {
    const result = Option.collect([Option.some(1), Option.none()]);
    expect(result.isNone()).toBe(true);
  });

  it('should return Some([]) for an empty array', () => {
    expect(Option.collect([]).unwrap()).toEqual([]);
  });
});

describe('Option.values', () => {
  it('should return an array with all Some values', () => {
    const result = Option.values([Option.some(1), Option.some(2), Option.some(3)]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should filter out None values and return only Some values', () => {
    const result = Option.values([Option.some(1), Option.none(), Option.some(3), Option.none()]);
    expect(result).toEqual([1, 3]);
  });

  it('should return an empty array when all options are None', () => {
    const result = Option.values([Option.none(), Option.none()]);
    expect(result).toEqual([]);
  });

  it('should return an empty array for an empty input', () => {
    expect(Option.values([])).toEqual([]);
  });

  it('should throw ResultTypeError when a non-Option value is in the array', () => {
    expect(() => Option.values([42 as never])).toThrow();
  });
});
