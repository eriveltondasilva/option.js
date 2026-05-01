import { describe, expect, it } from 'vitest';

import { formatForDisplay, isEmptyArray, NoneUnwrapError, ResultTypeError } from '@/utils';

// ---------------------------------------------------------------------------
// NoneUnwrapError
// ---------------------------------------------------------------------------

describe('NoneUnwrapError', () => {
  it('should have the name NoneUnwrapError', () => {
    const error = new NoneUnwrapError();
    expect(error.name).toBe('NoneUnwrapError');
  });

  it('should use the default message when none is provided', () => {
    const error = new NoneUnwrapError();
    expect(error.message).toBe('Called unwrap() on a None value');
  });

  it('should use a custom message when provided', () => {
    const error = new NoneUnwrapError('custom reason');
    expect(error.message).toBe('custom reason');
  });

  it('should be an instance of Error', () => {
    expect(new NoneUnwrapError()).toBeInstanceOf(Error);
  });

  it('should be catchable as an Error', () => {
    expect(() => {
      throw new NoneUnwrapError();
    }).toThrow(Error);
  });
});

// ---------------------------------------------------------------------------
// ResultTypeError
// ---------------------------------------------------------------------------

describe('ResultTypeError', () => {
  it('should have the name ResultTypeError', () => {
    const error = new ResultTypeError('bad value');
    expect(error.name).toBe('ResultTypeError');
  });

  it('should append the guidance message to the provided message', () => {
    const error = new ResultTypeError('bad value');
    expect(error.message).toContain('bad value');
    expect(error.message).toContain('Option.some() or Option.none()');
  });

  it('should be an instance of TypeError', () => {
    expect(new ResultTypeError('bad value')).toBeInstanceOf(TypeError);
  });

  it('should store the cause when provided', () => {
    const cause = { invalid: true };
    const error = new ResultTypeError('bad value', cause);
    expect(error.cause).toBe(cause);
  });
});

// ---------------------------------------------------------------------------
// isEmptyArray
// ---------------------------------------------------------------------------

describe('isEmptyArray', () => {
  it('should return true for an empty array', () => {
    expect(isEmptyArray([])).toBe(true);
  });

  it('should return false for a non-empty array', () => {
    expect(isEmptyArray([1, 2, 3])).toBe(false);
  });

  it('should return false for an array with one element', () => {
    expect(isEmptyArray([null])).toBe(false);
  });

  it('should throw TypeError when the value is not an array', () => {
    expect(() => isEmptyArray('not an array')).toThrow(TypeError);
  });

  it('should throw TypeError when the value is null', () => {
    expect(() => isEmptyArray(null)).toThrow(TypeError);
  });

  it('should throw TypeError when the value is a plain object', () => {
    expect(() => isEmptyArray({})).toThrow(TypeError);
  });
});

// ---------------------------------------------------------------------------
// formatForDisplay
// ---------------------------------------------------------------------------

describe('formatForDisplay', () => {
  it('should return "null" for null', () => {
    expect(formatForDisplay(null)).toBe('null');
  });

  it('should return "undefined" for undefined', () => {
    expect(formatForDisplay(undefined)).toBe('undefined');
  });

  it('should return the number as a string', () => {
    expect(formatForDisplay(42)).toBe('42');
  });

  it('should return "true" for boolean true', () => {
    expect(formatForDisplay(true)).toBe('true');
  });

  it('should return "false" for boolean false', () => {
    expect(formatForDisplay(false)).toBe('false');
  });

  it('should return a bigint with the "n" suffix', () => {
    expect(formatForDisplay(9007199254740991n)).toBe('9007199254740991n');
  });

  it('should return the symbol description', () => {
    expect(formatForDisplay(Symbol('id'))).toBe('Symbol(id)');
  });

  it('should wrap a short string in double quotes', () => {
    expect(formatForDisplay('hello')).toBe('"hello"');
  });

  it('should truncate a string longer than 100 characters and add ellipsis', () => {
    const long = 'a'.repeat(101);
    const result = formatForDisplay(long);
    expect(result).toContain('...');
    expect(result.length).toBe(105);
  });

  it('should format an Error with name and message', () => {
    const error = new Error('something went wrong');
    expect(formatForDisplay(error)).toBe('Error: something went wrong');
  });

  it('should include the cause in the Error representation', () => {
    const error = new Error('outer', { cause: 'inner reason' });
    expect(formatForDisplay(error)).toContain('cause');
    expect(formatForDisplay(error)).toContain('inner reason');
  });

  it('should format a small array inline', () => {
    expect(formatForDisplay([1, 2, 3])).toBe('[1, 2, 3]');
  });

  it('should abbreviate arrays with more than 5 elements', () => {
    expect(formatForDisplay([1, 2, 3, 4, 5, 6])).toBe('Array(6)');
  });

  it('should serialize a plain object as JSON', () => {
    expect(formatForDisplay({ x: 1 })).toBe('{"x":1}');
  });

  it('should truncate a long JSON object and add ellipsis', () => {
    const big = { data: 'x'.repeat(200) };
    const result = formatForDisplay(big);
    expect(result).toContain('...');
  });

  it('should return the constructor name for non-serializable objects', () => {
    const circular: Record<string, unknown> = {};
    // biome-ignore lint/complexity/useLiteralKeys: false positive
    circular['self'] = circular;
    const result = formatForDisplay(circular);
    expect(result).toBe('Object');
  });
});
