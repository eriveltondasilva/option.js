/** biome-ignore-all lint/suspicious/noExplicitAny: arquivo de testes */
import { describe, expect, it, vi } from 'vitest'

import { NoneClass as None } from './none.ts'
import * as Option from './option.ts'
import { Some } from './some.ts'

const expectSome = <T>(opt: any, value: T) => {
  expect(opt.isSome()).toBe(true)
  expect(opt.unwrap()).toBe(value)
}

describe('Some', () => {
  describe('Type Guards', () => {
    it('should return true for isSome', () => {
      expect(new Some(42).isSome()).toBe(true)
    })

    it('should return false for isNone', () => {
      expect(new Some(42).isNone()).toBe(false)
    })

    it('should evaluate predicate in isSomeAnd', () => {
      expect(new Some(10).isSomeAnd((v) => v > 5)).toBe(true)
      expect(new Some(3).isSomeAnd((v) => v > 5)).toBe(false)
    })

    it('should evaluate predicate in isNoneOr', () => {
      expect(new Some(10).isNoneOr((v) => v > 5)).toBe(true)
      expect(new Some(3).isNoneOr((v) => v > 5)).toBe(false)
    })
  })

  describe('Extraction', () => {
    it('should return value with unwrap', () => {
      expect(new Some(42).unwrap()).toBe(42)
      expect(new Some('hello').unwrap()).toBe('hello')
      expect(new Some({ a: 1 }).unwrap()).toEqual({ a: 1 })
    })

    it('should preserve reference when unwrapping objects', () => {
      const obj = { a: 1 }
      expect(new Some(obj).unwrap()).toBe(obj)
    })

    it('should return value and not call function in unwrapOrElse', () => {
      const fallback = vi.fn(() => 99)
      const result = new Some(42).unwrapOrElse(fallback)

      expect(result).toBe(42)
      expect(fallback).not.toHaveBeenCalled()
    })
  })

  describe('Transformation', () => {
    it('should transform value with map', () => {
      expectSome(
        new Some(5).map((v) => v * 2),
        10,
      )
    })

    it('should transform to different type with map', () => {
      expectSome(
        new Some(42).map((v) => `value: ${v}`),
        'value: 42',
      )
    })

    it('should not mutate original Some', () => {
      const original = new Some(10)
      const result = original.map((v) => v * 2)

      expect(original.unwrap()).toBe(10)
      expect(result.unwrap()).toBe(20)
    })

    it('should propagate errors in map', () => {
      const error = new Error('fail')

      expect(() =>
        new Some(1).map(() => {
          throw error
        }),
      ).toThrow(error)
    })

    it('should return None when filter predicate is false', () => {
      expect(new Some(3).filter((v) => v > 5).isNone()).toBe(true)
    })

    it('should not execute map after filter returns None', () => {
      const mapSpy = vi.fn()
      new Some(10).filter(() => false).map(mapSpy)

      expect(mapSpy).not.toHaveBeenCalled()
    })

    // IMPROVED: flatten mais profundo
    it('should deeply flatten nested Some', () => {
      const nested = new Some(new Some(new Some(42)))
      // @ts-expect-error: teste de flatten profundo
      const result = nested.flatten().flatten()

      expect(result.unwrap()).toBe(42)
    })
  })

  describe('Alternation', () => {
    it('should return other with and', () => {
      expectSome(new Some(1).and(Option.some(2)), 2)
    })

    it('should return None when and receives None', () => {
      expect(new Some(1).and(None).isNone()).toBe(true)
    })

    it('should return itself with or', () => {
      expectSome(new Some(1).or(Option.some(2)), 1)
    })

    it('should return same instance in or', () => {
      const some = new Some(1)
      const result = some.or(Option.some(2))

      expect(result).toBe(some)
    })

    it('should not call fallback in orElse', () => {
      const fallback = vi.fn(() => Option.some(2))
      const result = new Some(1).orElse(fallback)

      expect(result.unwrap()).toBe(1)
      expect(fallback).not.toHaveBeenCalled()
    })
  })

  describe('Combination', () => {
    it('should zip with another Some', () => {
      const result = new Some(1).zip(Option.some(2)).unwrap()

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(result).toEqual([1, 2])
    })

    it('should return None when zipping with None', () => {
      expect(new Some(1).zip(None).isNone()).toBe(true)
    })
  })

  describe('Inspection', () => {
    it('should execute function and return self in inspect', () => {
      const spy = vi.fn()
      const some = new Some(42)

      const result = some.inspect(spy)

      expect(spy).toHaveBeenCalledWith(42)
      expect(result).toBe(some)
    })

    it('should preserve execution order in chain', () => {
      const calls: number[] = []

      new Some(10)
        .inspect((v) => calls.push(v))
        .map((v) => v * 2)
        .inspect((v) => calls.push(v))

      expect(calls).toEqual([10, 20])
    })
  })

  describe('Chaining', () => {
    it('should chain multiple operations', () => {
      const result = new Some(10)
        .map((v) => v * 2)
        .filter((v) => v > 15)
        .map((v) => v + 5)
        .unwrapOr(0)

      expect(result).toBe(25)
    })

    it('should short-circuit on failure', () => {
      const result = new Some(10)
        .map((v) => v * 2)
        .filter((v) => v > 100)
        .map((v) => v + 5)
        .unwrapOr(0)

      expect(result).toBe(0)
    })
  })
})
