import { describe, expect, it } from 'vitest';

import { Option } from '@/.';

describe('Some.unwrap', () => {
  it('should return the contained value', () => {
    expect(Option.some(42).unwrap()).toBe(42);
  });

  it('should return the contained object by reference', () => {
    const obj = { x: 1 };
    expect(Option.some(obj).unwrap()).toBe(obj);
  });
});

describe('None.unwrap', () => {
  it('should throw NoneUnwrapError', () => {
    expect(() => Option.none().unwrap()).toThrow('unwrap');
  });

  it('should throw an error named NoneUnwrapError', () => {
    expect(() => Option.none().unwrap()).toThrowError(
      expect.objectContaining({ name: 'NoneUnwrapError' }),
    );
  });
});

describe('Some.expect', () => {
  it('should return the contained value', () => {
    expect(Option.some(99).expect('should not fail')).toBe(99);
  });
});

describe('None.expect', () => {
  it('should throw with the provided message', () => {
    expect(() => Option.none().expect('custom error')).toThrow('custom error');
  });

  it('should throw an error named NoneUnwrapError', () => {
    expect(() => Option.none().expect('oops')).toThrowError(
      expect.objectContaining({ name: 'NoneUnwrapError' }),
    );
  });
});

describe('Some.unwrapOr', () => {
  it('should return the contained value ignoring the default', () => {
    expect(Option.some(10).unwrapOr(99)).toBe(10);
  });
});

describe('None.unwrapOr', () => {
  it('should return the provided default value', () => {
    expect(Option.none().unwrapOr(99)).toBe(99);
  });

  it('should return the default even when it is falsy', () => {
    expect(Option.none().unwrapOr(0)).toBe(0);
  });
});

describe('Some.unwrapOrElse', () => {
  it('should return the contained value without calling the fallback', () => {
    const fallback = () => 99;
    expect(Option.some(10).unwrapOrElse(fallback)).toBe(10);
  });
});

describe('None.unwrapOrElse', () => {
  it('should call the fallback and return its result', () => {
    expect(Option.none().unwrapOrElse(() => 'default')).toBe('default');
  });
});
