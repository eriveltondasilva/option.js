import { describe, expect, it, vi } from 'vitest'

import { NoneUnwrapError } from './errors.ts'
import { NoneClass as None } from './none.ts'
import { Some } from './some.ts'

describe('None', () => {
  describe('Verification', () => {
    it('should identify correctly', () => {
      expect(None.isSome()).toBe(false)
      expect(None.isNone()).toBe(true)
      expect(None._tag).toBe('None')
    })

    it('should return fixed values for predicate checks', () => {
      const predicate = (v: never) => v === 42

      expect(None.isSomeAnd(predicate)).toBe(false)
      expect(None.isNoneOr(predicate)).toBe(true)
    })
  })

  describe('Extraction', () => {
    it('should throw NoneUnwrapError on unwrap', () => {
      expect(() => None.unwrap()).toThrow(NoneUnwrapError)
    })

    it('should throw with custom message on expect', () => {
      const message = 'Custom error message'

      expect(() => None.expect(message)).toThrow(message)
      expect(() => None.expect(message)).toThrow(NoneUnwrapError)
    })

    it('should return defaults on unwrapOr/unwrapOrElse', () => {
      expect(None.unwrapOr(99)).toBe(99)
      expect(None.unwrapOrElse(() => 42)).toBe(42)
    })
  })

  describe('Transformation', () => {
    it('should return itself on map, filter and flatten', () => {
      const fn = vi.fn()

      expect(None.map(fn)).toBe(None)
      expect(None.filter(() => true)).toBe(None)
      expect(None.flatten()).toBe(None)

      expect(fn).not.toHaveBeenCalled()
    })

    it('should return provided defaults on mapOr/mapOrElse', () => {
      expect(None.mapOr((v) => v, 'default')).toBe('default')
      expect(
        None.mapOrElse(
          () => 'mapped',
          () => 'fallback',
        ),
      ).toBe('fallback')
    })
  })

  describe('Chaining & Alternatives', () => {
    it('should always return itself on and()', () => {
      const other = new Some(42)

      expect(None.and(other)).toBe(None)
      expect(None.and(None)).toBe(None)
    })

    it('should return itself on andThen', () => {
      expect(None.andThen(() => new Some(1))).toBe(None)
    })

    it('should return the alternative on or/orElse', () => {
      const other = new Some(42)

      expect(None.or(other)).toBe(other)
      expect(None.orElse(() => other)).toBe(other)
    })
  })

  describe('Inspection & Conversion', () => {
    it('should execute the none branch on match', () => {
      const result = None.match({ some: () => 'got value', none: () => 'empty' })

      expect(result).toBe('empty')
    })

    it('should not execute inspect callback', () => {
      const spyFn = vi.fn()
      const result = None.inspect(spyFn)

      expect(spyFn).not.toHaveBeenCalled()
      expect(result).toBe(None)
    })

    it('should convert to null/undefined', () => {
      expect(None.toNullable()).toBe(null)
    })
  })
})
