/** biome-ignore-all lint/suspicious/noExplicitAny: arquivo de testes */
import { describe, expect, it, vi } from 'vitest';

import { NoneUnwrapError } from '@/errors.ts';
import { NoneClass as None } from '@/none.ts';
import * as Option from '@/option.ts';

const expectNone = (opt: any) => {
  expect(opt.isNone()).toBe(true);
};

describe('None', () => {
  describe('Singleton', () => {
    it('should always return the same instance', () => {
      expect(Option.none()).toBe(None);
      expect(Option.none()).toBe(Option.none());
    });
  });

  describe('Type Guards', () => {
    it('should return false for isSome', () => {
      expect(None.isSome()).toBe(false);
    });

    it('should return true for isNone', () => {
      expect(None.isNone()).toBe(true);
    });

    it('should not call predicate in isSomeAnd', () => {
      const spy = vi.fn();
      const result = None.isSomeAnd(spy);

      expect(result).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call predicate in isNoneOr', () => {
      const spy = vi.fn();
      const result = None.isNoneOr(spy);

      expect(result).toBe(true);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Extraction', () => {
    it('should throw NoneUnwrapError on unwrap', () => {
      expect(() => None.unwrap()).toThrow(NoneUnwrapError);
      expect(() => None.unwrap()).toThrow('Called unwrap() on a None value');
    });

    it('should throw NoneUnwrapError with custom message on expect', () => {
      expect(() => None.expect('custom error')).toThrow(NoneUnwrapError);
      expect(() => None.expect('custom error')).toThrow('custom error');
    });

    it('should throw consistently on multiple unwrap calls', () => {
      expect(() => None.unwrap()).toThrow();
      expect(() => None.unwrap()).toThrow();
    });

    it('should return default value with unwrapOr', () => {
      expect(None.unwrapOr(42)).toBe(42);
      expect(None.unwrapOr('default')).toBe('default');
      expect(None.unwrapOr({ a: 1 })).toEqual({ a: 1 });
    });

    it('should call fallback in unwrapOrElse', () => {
      const fallback = vi.fn(() => 42);
      const result = None.unwrapOrElse(fallback);

      expect(result).toBe(42);
      expect(fallback).toHaveBeenCalledOnce();
    });
  });

  describe('Transformation', () => {
    it('should return None and not call function in map', () => {
      const spy = vi.fn();
      const result = None.map(spy);

      expectNone(result);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return default and not call function in mapOr', () => {
      const spy = vi.fn();
      const result = None.mapOr(spy, 99);

      expect(result).toBe(99);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call only defaultFn in mapOrElse', () => {
      const fnSpy = vi.fn();
      const defaultSpy = vi.fn(() => 99);
      const result = None.mapOrElse(fnSpy, defaultSpy);

      expect(result).toBe(99);
      expect(fnSpy).not.toHaveBeenCalled();
      expect(defaultSpy).toHaveBeenCalledOnce();
    });

    it('should return None and not call predicate in filter', () => {
      const spy = vi.fn();
      const result = None.filter(spy);

      expectNone(result);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return same instance in filter', () => {
      const result = None.filter(() => true);
      expect(result).toBe(None);
    });

    it('should return None in flatten', () => {
      expectNone(None.flatten());
    });
  });

  describe('Alternation', () => {
    it('should return None in and', () => {
      expectNone(None.and(Option.some(42)));
    });

    it('should not call function in andThen', () => {
      const spy = vi.fn();
      const result = None.andThen(spy);

      expectNone(result);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return other option in or', () => {
      const result = None.or(Option.some(42));
      expect(result.unwrap()).toBe(42);
    });

    it('should return same instance when or receives None', () => {
      const result = None.or(None);
      expect(result).toBe(None);
    });

    it('should call fallback in orElse', () => {
      const spy = vi.fn(() => Option.some(42));
      const result = None.orElse(spy);

      expect(result.unwrap()).toBe(42);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('Combination', () => {
    it('should return None in zip', () => {
      expectNone(None.zip(Option.some(42)));
    });

    it('should not call function in zipWith', () => {
      const spy = vi.fn();
      const result = None.zipWith(Option.some(42), spy);

      expectNone(result);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Inspection', () => {
    it('should call only none handler in match', () => {
      const someSpy = vi.fn();
      const noneSpy = vi.fn(() => 99);

      const result = None.match({
        some: someSpy,
        none: noneSpy,
      });

      expect(result).toBe(99);
      expect(someSpy).not.toHaveBeenCalled();
      expect(noneSpy).toHaveBeenCalledOnce();
    });

    it('should not call function in inspect', () => {
      const spy = vi.fn();
      const result = None.inspect(spy);

      expectNone(result);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call function in tap', () => {
      const spy = vi.fn();
      const result = None.tap(spy);

      expectNone(result);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Conversion', () => {
    it('should return null with toNullable', () => {
      expect(None.toNullable()).toBe(null);
    });

    it('should return undefined with toUndefined', () => {
      expect(None.toUndefined()).toBe(undefined);
    });
  });

  describe('Chaining', () => {
    it('should short-circuit entire chain', () => {
      const mapSpy = vi.fn();
      const filterSpy = vi.fn();
      const inspectSpy = vi.fn();

      const result = None.map(mapSpy).filter(filterSpy).inspect(inspectSpy).unwrapOr(99);

      expect(result).toBe(99);

      expect(mapSpy).not.toHaveBeenCalled();
      expect(filterSpy).not.toHaveBeenCalled();
      expect(inspectSpy).not.toHaveBeenCalled();
    });

    it('should resume execution after or', () => {
      const calls: string[] = [];

      None.map(() => {
        calls.push('map');
        return 42;
      })
        .or(Option.some(10))
        .map((v) => {
          calls.push('map-after-or');
          return v * 2;
        })
        .unwrap();

      expect(calls).toEqual(['map-after-or']);
    });
  });
});
