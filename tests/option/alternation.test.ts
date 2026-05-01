import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Some.and', () => {
  it('should return the other Some when current is Some', () => {
    const result = Option.some(10).and(Option.some(20));
    expect(result.unwrap()).toBe(20);
  });

  it('should return None when the other option is None', () => {
    const result = Option.some(10).and(Option.none());
    expect(result.isNone()).toBe(true);
  });
});

describe('None.and', () => {
  it('should return None regardless of the other option', () => {
    expect(Option.none().and(Option.some(99)).isNone()).toBe(true);
  });
});

describe('Some.andThen', () => {
  it('should apply the function and return its result when Some', () => {
    const result = Option.some(5).andThen((v) => Option.some(v * 2));
    expect(result.unwrap()).toBe(10);
  });

  it('should return None when the function returns None', () => {
    const result = Option.some(5).andThen(() => Option.none());
    expect(result.isNone()).toBe(true);
  });

  it('should support chaining as a flatMap', () => {
    const result = Option.some('42')
      .andThen((s) => Option.fromTry(() => parseInt(s, 10)))
      .andThen((n) => Option.validate(n, (v) => v > 0));
    expect(result.unwrap()).toBe(42);
  });
});

describe('None.andThen', () => {
  it('should return None without calling the function', () => {
    const result = Option.none().andThen(() => Option.some(99));
    expect(result.isNone()).toBe(true);
  });
});

describe('Some.or', () => {
  it('should return itself ignoring the other option', () => {
    const result = Option.some(10).or(Option.some(99));
    expect(result.unwrap()).toBe(10);
  });
});

describe('None.or', () => {
  it('should return the other Some when current is None', () => {
    const result = Option.none().or(Option.some(99));
    expect(result.unwrap()).toBe(99);
  });

  it('should return None when the other option is also None', () => {
    const result = Option.none().or(Option.none());
    expect(result.isNone()).toBe(true);
  });
});

describe('Some.orElse', () => {
  it('should return itself without calling the fallback', () => {
    const result = Option.some(10).orElse(() => Option.some(99));
    expect(result.unwrap()).toBe(10);
  });
});

describe('None.orElse', () => {
  it('should call the fallback and return its result', () => {
    const result = Option.none().orElse(() => Option.some(99));
    expect(result.unwrap()).toBe(99);
  });

  it('should return None when the fallback returns None', () => {
    const result = Option.none().orElse(() => Option.none());
    expect(result.isNone()).toBe(true);
  });
});
