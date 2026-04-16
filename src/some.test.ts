import { describe, expect, it, vi } from 'vitest'

import { NoneClass as None } from './none'
import { Some } from './some'

describe('Some', () => {
  describe('Verification', () => {
    it('should identify correctly', () => {
      const some = new Some(42)

      expect(some.isSome()).toBe(true)
      expect(some.isNone()).toBe(false)
      expect(some._tag).toBe('Some')
    })

    it('should evaluate isSomeAnd and isNoneOr based on predicate', () => {
      const some = new Some(42)

      expect(some.isSomeAnd((val) => val === 42)).toBe(true)
      expect(some.isSomeAnd((val) => val === 99)).toBe(false)

      expect(some.isNoneOr((val) => val === 42)).toBe(true)
      expect(some.isNoneOr((val) => val === 99)).toBe(false)
    })
  })

  describe('Extraction', () => {
    it('should return value on unwrap and expect', () => {
      const some = new Some('data')

      expect(some.unwrap()).toBe('data')
      expect(some.expect('This should not throw')).toBe('data')
    })

    it('should return wrapped value, ignoring defaults on unwrapOr/unwrapOrElse', () => {
      const some = new Some(10)

      expect(some.unwrapOr(99)).toBe(10)
      expect(some.unwrapOrElse(() => 99)).toBe(10)
    })
  })

  describe('Transformation', () => {
    it('should map the value correctly', () => {
      const result = new Some(10).map((val) => val * 2)

      expect(result.unwrap()).toBe(20)
    })

    it('should apply map ignoring defaults on mapOr/mapOrElse', () => {
      const some = new Some(10)

      expect(some.mapOr((val) => val * 2, 99)).toBe(20)
      expect(
        some.mapOrElse(
          (val) => val * 2,
          () => 99,
        ),
      ).toBe(20)
    })

    it('should filter correctly turning into None if predicate fails', () => {
      const some = new Some(10)

      expect(some.filter((val) => val > 5).isSome()).toBe(true)
      expect(some.filter((val) => val > 15).isNone()).toBe(true)
    })

    it('should flatten nested Options', () => {
      const nested = new Some(new Some('inner'))

      expect(nested.flatten().unwrap()).toBe('inner')
    })
  })

  describe('Chaining & Alternatives', () => {
    it('should return the other option on and()', () => {
      const some = new Some(1)
      const otherSome = new Some(2)

      expect(some.and(otherSome)).toBe(otherSome)
      expect(some.and(None)).toBe(None)
    })

    it('should chain with andThen', () => {
      const some = new Some(42)

      expect(some.andThen((val) => new Some(val * 2)).unwrap()).toBe(84)
      expect(some.andThen(() => None).isNone()).toBe(true)
    })

    it('should ignore alternatives returning itself on or/orElse', () => {
      const some = new Some(10)
      const other = new Some(99)

      expect(some.or(other).unwrap()).toBe(10)
      expect(some.orElse(() => other).unwrap()).toBe(10)
    })
  })

  describe('Inspection & Conversion', () => {
    it('should execute the some branch on match', () => {
      const result = new Some('hello').match({
        some: (val) => `got: ${val}`,
        none: () => 'nothing',
      })

      expect(result).toBe('got: hello')
    })

    it('should run inspect for side effects and return itself', () => {
      const some = new Some(42)
      const spyFn = vi.fn()

      const result = some.inspect(spyFn)

      expect(spyFn).toHaveBeenCalledWith(42)
      expect(result).toBe(some)
    })

    it('should convert to underlying value on toNullable/toUndefined', () => {
      const some = new Some(42)

      expect(some.toNullable()).toBe(42)
    })
  })
})
