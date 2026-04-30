import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Option.isSome', () => {
  it('should return true for a Some value', () => {
    expect(Option.isSome(Option.some(1))).toBe(true);
  });

  it('should return false for a None value', () => {
    expect(Option.isSome(Option.none())).toBe(false);
  });

  it('should return false for a plain object', () => {
    expect(Option.isSome({ value: 1 })).toBe(false);
  });

  it('should return false for null', () => {
    expect(Option.isSome(null)).toBe(false);
  });
});

describe('Option.isNone', () => {
  it('should return true for a None value', () => {
    expect(Option.isNone(Option.none())).toBe(true);
  });

  it('should return false for a Some value', () => {
    expect(Option.isNone(Option.some(1))).toBe(false);
  });

  it('should return false for a plain object', () => {
    expect(Option.isNone({ value: null })).toBe(false);
  });
});

describe('Option.isOption', () => {
  it('should return true for Some', () => {
    expect(Option.isOption(Option.some(42))).toBe(true);
  });

  it('should return true for None', () => {
    expect(Option.isOption(Option.none())).toBe(true);
  });

  it('should return false for a plain object', () => {
    expect(Option.isOption({ _tag: 'other' })).toBe(false);
  });

  it('should return false for null', () => {
    expect(Option.isOption(null)).toBe(false);
  });

  it('should return false for a primitive', () => {
    expect(Option.isOption(42)).toBe(false);
  });
});

describe('Some.isSomeAnd', () => {
  it('should return true when value satisfies the condition', () => {
    expect(Option.some(10).isSomeAnd((v) => v > 5)).toBe(true);
  });

  it('should return false when value does not satisfy the condition', () => {
    expect(Option.some(3).isSomeAnd((v) => v > 5)).toBe(false);
  });
});

describe('None.isSomeAnd', () => {
  it('should always return false', () => {
    expect(Option.none().isSomeAnd(() => true)).toBe(false);
  });
});

describe('Some.isNoneOr', () => {
  it('should return true when value satisfies the condition', () => {
    expect(Option.some(10).isNoneOr((v) => v > 5)).toBe(true);
  });

  it('should return false when value does not satisfy the condition', () => {
    expect(Option.some(3).isNoneOr((v) => v > 5)).toBe(false);
  });
});

describe('None.isNoneOr', () => {
  it('should always return true', () => {
    expect(Option.none().isNoneOr(() => false)).toBe(true);
  });
});
