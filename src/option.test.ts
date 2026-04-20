/** biome-ignore-all lint/suspicious/noExplicitAny: arquivo de testes */
import { describe, expect, it } from 'vitest'

import * as Option from './option.ts'

describe('Type Guards', () => {
  describe('isSome', () => {
    it('should return true for Some values', () => {
      expect(Option.isSome(Option.some(42))).toBe(true)
    })

    it('should return false for None', () => {
      expect(Option.isSome(Option.none())).toBe(false)
    })

    it.each([
      42,
      'hello',
      null,
      undefined,
      {},
      { _tag: 'Other' },
    ])('should return false for non-Option values', (value) => {
      expect(Option.isSome(value)).toBe(false)
    })
  })

  describe('isNone', () => {
    it('should return true for None', () => {
      expect(Option.isNone(Option.none())).toBe(true)
    })

    it('should return false for Some values', () => {
      expect(Option.isNone(Option.some(42))).toBe(false)
    })

    it.each([
      42,
      'hello',
      null,
      undefined,
      {},
      { _tag: 'Other' },
    ])('should return false for non-Option values', (value) => {
      expect(Option.isNone(value)).toBe(false)
    })
  })

  describe('isOption', () => {
    it('should return true for Some values', () => {
      expect(Option.isOption(Option.some(42))).toBe(true)
    })

    it('should return true for None', () => {
      expect(Option.isOption(Option.none())).toBe(true)
    })

    it.each([
      42,
      'hello',
      null,
      undefined,
      {},
      { _tag: 'Other' },
    ])('should return false for non-Option values', (value) => {
      expect(Option.isOption(value)).toBe(false)
    })
  })
})

describe('Creation', () => {
  describe('some', () => {
    it('should create Some with value', () => {
      const opt = Option.some(42)
      expect(opt.isSome()).toBe(true)
      expect(opt.unwrap()).toBe(42)
    })

    it('should create Some with different types', () => {
      expect(Option.some('hello').unwrap()).toBe('hello')
      expect(Option.some(true).unwrap()).toBe(true)
      expect(Option.some({ a: 1 }).unwrap()).toEqual({ a: 1 })
      expect(Option.some([1, 2, 3]).unwrap()).toEqual([1, 2, 3])
    })

    it('should create Some even with null/undefined', () => {
      expect(Option.some(null).unwrap()).toBe(null)
      expect(Option.some(undefined).unwrap()).toBe(undefined)
    })
  })

  describe('none', () => {
    it('should create None', () => {
      const opt = Option.none()
      expect(opt.isNone()).toBe(true)
    })

    it('should return the same singleton instance', () => {
      const opt1 = Option.none()
      const opt2 = Option.none()
      expect(opt1).toBe(opt2)
    })
  })

  describe('fromTry', () => {
    it('should return Some when function succeeds', () => {
      const opt = Option.fromTry(() => 42)
      expect(opt.isSome()).toBe(true)
      expect(opt.unwrap()).toBe(42)
    })

    it('should return None when function throws', () => {
      const opt = Option.fromTry(() => {
        throw new Error('error')
      })
      expect(opt.isNone()).toBe(true)
    })
  })

  describe('fromPromise', () => {
    it('should return Some when promise resolves', async () => {
      const opt = await Option.fromPromise(async () => 42)
      expect(opt.isSome()).toBe(true)
      expect(opt.unwrap()).toBe(42)
    })

    it('should return None when promise rejects', async () => {
      const opt = await Option.fromPromise(async () => {
        throw new Error('error')
      })
      expect(opt.isNone()).toBe(true)
    })

    it('should handle delayed promises', async () => {
      const opt = await Option.fromPromise(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return 'delayed'
      })
      expect(opt.unwrap()).toBe('delayed')
    })
  })

  describe('fromNullable', () => {
    it.each([42, 'hello', 0, '', false])('should return Some for non-null values', (value) => {
      expect(Option.fromNullable(value).isSome()).toBe(true)
    })

    it('should return None for null', () => {
      expect(Option.fromNullable(null).isNone()).toBe(true)
    })

    it('should return None for undefined', () => {
      expect(Option.fromNullable(undefined).isNone()).toBe(true)
    })
  })

  describe('validate', () => {
    it('should return Some when predicate is true', () => {
      const opt = Option.validate(42, (val) => val > 10)
      expect(opt.isSome()).toBe(true)
      expect(opt.unwrap()).toBe(42)
    })

    it('should return None when predicate is false', () => {
      const opt = Option.validate(5, (val) => val > 10)
      expect(opt.isNone()).toBe(true)
    })

    it('should work with different types', () => {
      expect(Option.validate('hello', (s) => s.length > 3).isSome()).toBe(true)
      expect(Option.validate('hi', (s) => s.length > 3).isNone()).toBe(true)
      expect(Option.validate([1, 2, 3], (arr) => arr.length === 3).isSome()).toBe(true)
    })
  })
})

describe('Collection', () => {
  describe('all', () => {
    it('should return Some with array of values when all are Some', () => {
      const opts = [Option.some(1), Option.some(2), Option.some(3)]
      const result = Option.all(opts)
      expect(result.isSome()).toBe(true)
      expect(result.unwrap()).toEqual([1, 2, 3])
    })

    it('should return None if any option is None', () => {
      const opts = [Option.some(1), Option.none(), Option.some(3)]
      const result = Option.all(opts)
      expect(result.isNone()).toBe(true)
    })

    it('should return Some([]) for empty array', () => {
      const result = Option.all([])
      expect(result.isSome()).toBe(true)
      expect(result.unwrap()).toEqual([])
    })

    it('should throw error for non-Option values', () => {
      const opts = [Option.some(1), 'not-option' as any, Option.some(3)]
      expect(() => Option.all(opts)).toThrow(
        'Option.all() called with non-Option value at index 1: string',
      )
    })

    it('should throw error with correct index', () => {
      const opts = [Option.some(1), Option.some(2), null as any]
      expect(() => Option.all(opts)).toThrow(
        'Option.all() called with non-Option value at index 2: object',
      )
    })

    it('should return Some([]) for non-array input', () => {
      const result = Option.all('not-array' as any)
      expect(result.isSome()).toBe(true)
      expect(result.unwrap()).toEqual([])
    })

    it('should short-circuit on first None', () => {
      const opts = [Option.some(1), Option.none(), Option.some(3)]
      const result = Option.all(opts)
      expect(result.isNone()).toBe(true)
    })
  })

  describe('collect', () => {
    it('should be an alias for all', () => {
      const opts = [Option.some(1), Option.some(2), Option.some(3)]
      expect(Option.collect(opts)).toEqual(Option.all(opts))
    })

    it('should return None if any option is None', () => {
      const opts = [Option.some(1), Option.none(), Option.some(3)]
      expect(Option.collect(opts).isNone()).toBe(true)
    })

    it('should throw error for non-Option values', () => {
      const opts = [Option.some(1), 'not-option' as any, Option.some(3)]
      expect(() => Option.collect(opts)).toThrow(
        'Option.collect() called with non-Option value at index 1: string',
      )
    })
  })

  describe('values', () => {
    it('should return array of Some values only', () => {
      const opts = [Option.some(1), Option.some(2), Option.some(3)]
      const result = Option.values(opts)
      expect(result).toEqual([1, 2, 3])
    })

    it('should filter out None values', () => {
      const opts = [Option.some(1), Option.none(), Option.some(3), Option.none()]
      const result = Option.values(opts)
      expect(result).toEqual([1, 3])
    })

    it('should return empty array for all None', () => {
      const opts = [Option.none(), Option.none(), Option.none()]
      const result = Option.values(opts)
      expect(result).toEqual([])
    })

    it('should return empty array for empty input', () => {
      const result = Option.values([])
      expect(result).toEqual([])
    })

    it('should throw error for non-Option values', () => {
      expect(() => Option.values([Option.some(1), 'not-option' as any, Option.some(3)])).toThrow(
        'Option.values() called with non-Option value at index 1: string',
      )
    })

    it('should throw error with correct index', () => {
      expect(() => Option.values([Option.some(1), Option.some(2), {} as any])).toThrow(
        'Option.values() called with non-Option value at index 2: object',
      )
    })

    it('should return empty array for non-array input', () => {
      const result = Option.values('not-array' as any)
      expect(result).toEqual([])
    })
  })
})
