import { describe, expect, it, vi } from 'vitest';

import { Option } from '@/.';

describe('Some.match', () => {
  it('should call the some handler with the contained value', () => {
    const result = Option.some(5).match({
      some: (v) => v * 2,
      none: () => -1,
    });
    expect(result).toBe(10);
  });
});

describe('None.match', () => {
  it('should call the none handler', () => {
    const result = Option.none().match({
      some: () => 'has value',
      none: () => 'empty',
    });
    expect(result).toBe('empty');
  });
});

describe('Some.inspect', () => {
  it('should call the function with the contained value', () => {
    const fn = vi.fn();
    Option.some(42).inspect(fn);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('should return the same Some after calling inspect', () => {
    const opt = Option.some(42);
    const result = opt.inspect(() => {});
    expect(result.unwrap()).toBe(42);
  });
});

describe('None.inspect', () => {
  it('should not call the function', () => {
    const fn = vi.fn();
    Option.none().inspect(fn);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('Some.tap', () => {
  it('should behave identically to inspect', () => {
    const fn = vi.fn();
    Option.some(7).tap(fn);
    expect(fn).toHaveBeenCalledWith(7);
  });
});

describe('None.tap', () => {
  it('should not call the function', () => {
    const fn = vi.fn();
    Option.none().tap(fn);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('Some.toNullable', () => {
  it('should return the contained value', () => {
    expect(Option.some(10).toNullable()).toBe(10);
  });
});

describe('None.toNullable', () => {
  it('should return null', () => {
    expect(Option.none().toNullable()).toBeNull();
  });
});

describe('Some.toUndefined', () => {
  it('should return the contained value', () => {
    expect(Option.some(10).toUndefined()).toBe(10);
  });
});

describe('None.toUndefined', () => {
  it('should return undefined', () => {
    expect(Option.none().toUndefined()).toBeUndefined();
  });
});

describe('Some.toString', () => {
  it('should return a Some(value) string for a number', () => {
    expect(Option.some(42).toString()).toBe('Some(42)');
  });

  it('should return a Some(value) string for a quoted string', () => {
    expect(Option.some('hello').toString()).toBe('Some("hello")');
  });
});

describe('None.toString', () => {
  it('should return the string "None"', () => {
    expect(Option.none().toString()).toBe('None');
  });
});

describe('Some.toJSON', () => {
  it('should serialize to { type: some, value }', () => {
    expect(Option.some(42).toJSON()).toEqual({ type: 'some', value: 42 });
  });
});

describe('None.toJSON', () => {
  it('should serialize to { type: none, value: undefined }', () => {
    expect(Option.none().toJSON()).toEqual({ type: 'none', value: undefined });
  });
});
