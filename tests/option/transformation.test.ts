import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Some.map', () => {
  it('should apply the function to the contained value', () => {
    const result = Option.some(5).map((v) => v * 2);
    expect(result.unwrap()).toBe(10);
  });

  it('should return a new Some with the transformed type', () => {
    const result = Option.some('hello').map((s) => s.length);
    expect(result.unwrap()).toBe(5);
  });

  it('should allow chaining multiple maps', () => {
    const result = Option.some(2)
      .map((v) => v + 1)
      .map((v) => v * 3);
    expect(result.unwrap()).toBe(9);
  });
});

describe('None.map', () => {
  it('should return None without calling the function', () => {
    const result = Option.none().map(() => 99);
    expect(result.isNone()).toBe(true);
  });
});

describe('Some.mapOr', () => {
  it('should apply the function and return the result', () => {
    expect(Option.some('hello').mapOr((s) => s.length, 0)).toBe(5);
  });
});

describe('None.mapOr', () => {
  it('should return the default value without calling the function', () => {
    expect(Option.none().mapOr(() => 99, 0)).toBe(0);
  });
});

describe('Some.mapOrElse', () => {
  it('should apply the main function and ignore the fallback', () => {
    expect(
      Option.some(10).mapOrElse(
        (v) => v + 1,
        () => -1,
      ),
    ).toBe(11);
  });
});

describe('None.mapOrElse', () => {
  it('should call the fallback function and return its result', () => {
    expect(
      Option.none().mapOrElse(
        () => 99,
        () => 0,
      ),
    ).toBe(0);
  });
});

describe('Some.filter', () => {
  it('should return Some when the predicate is satisfied', () => {
    const result = Option.some(10).filter((v) => v > 5);
    expect(result.unwrap()).toBe(10);
  });

  it('should return None when the predicate is not satisfied', () => {
    const result = Option.some(3).filter((v) => v > 5);
    expect(result.isNone()).toBe(true);
  });
});

describe('None.filter', () => {
  it('should return None without calling the predicate', () => {
    const result = Option.none().filter(() => true);
    expect(result.isNone()).toBe(true);
  });
});

describe('Some.flatten', () => {
  it('should unwrap one level of nesting from Some(Some(x))', () => {
    const nested = Option.some(Option.some(42));
    expect(nested.flatten().unwrap()).toBe(42);
  });

  it('should return None when inner option is None', () => {
    const nested = Option.some(Option.none());
    expect(nested.flatten().isNone()).toBe(true);
  });
});

describe('None.flatten', () => {
  it('should return None', () => {
    expect(Option.none().flatten().isNone()).toBe(true);
  });
});
