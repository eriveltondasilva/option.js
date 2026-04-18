import { describe, expect, it } from 'vitest'

import { option as Option } from './option.ts'

describe('Option', () => {
  describe('Factories', () => {
    it('Option.none should expose the correct instance of None', () => {
      expect(Option.none().isNone()).toBe(true)
      expect(Option.none().isSome()).toBe(false)
    })

    it('Option.some should create an instance of Some', () => {
      const result = Option.some(42)
      expect(Option.isSome(result)).toBe(true)
      expect(result.unwrap()).toBe(42)
    })

    it('Option.fromNullable should convert values ​​correctly', () => {
      expect(Option.isSome(Option.fromNullable('test'))).toBe(true)

      expect(Option.isNone(Option.fromNullable(null))).toBe(true)
      expect(Option.isNone(Option.fromNullable(undefined))).toBe(true)
    })
  })

  describe('Type Guards', () => {
    const someValue = Option.some(10)
    const noneValue = Option.none

    it('isSome should only validate instances of Some', () => {
      expect(Option.isSome(someValue)).toBe(true)
      expect(Option.isSome(noneValue)).toBe(false)
      expect(Option.isSome(null)).toBe(false)
    })

    it('isNone should only validate instances of None', () => {
      expect(Option.isNone(noneValue)).toBe(true)
      expect(Option.isNone(someValue)).toBe(false)
      expect(Option.isNone(undefined)).toBe(false)
    })

    it('isOption should validate instances of Some or None', () => {
      expect(Option.isOption(someValue)).toBe(true)
      expect(Option.isOption(noneValue)).toBe(true)
      expect(Option.isOption('not-an-option')).toBe(false)
    })
  })
})
