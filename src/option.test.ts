import { describe, expect, it } from 'vitest'

import * as option from './option.ts'

describe('Option', () => {
  describe('Factories', () => {
    it('Option.none should expose the correct instance of None', () => {
      expect(option.none().isNone()).toBe(true)
      expect(option.none().isSome()).toBe(false)
    })

    it('Option.some should create an instance of Some', () => {
      const result = option.some(42)
      expect(option.isSome(result)).toBe(true)
      expect(result.unwrap()).toBe(42)
    })

    it('Option.fromNullable should convert values ​​correctly', () => {
      expect(option.isSome(option.fromNullable('test'))).toBe(true)

      expect(option.isNone(option.fromNullable(null))).toBe(true)
      expect(option.isNone(option.fromNullable(undefined))).toBe(true)
    })
  })

  describe('Type Guards', () => {
    const someValue = option.some(10)
    const noneValue = option.none

    it('isSome should only validate instances of Some', () => {
      expect(option.isSome(someValue)).toBe(true)
      expect(option.isSome(noneValue)).toBe(false)
      expect(option.isSome(null)).toBe(false)
    })

    it('isNone should only validate instances of None', () => {
      expect(option.isNone(noneValue)).toBe(true)
      expect(option.isNone(someValue)).toBe(false)
      expect(option.isNone(undefined)).toBe(false)
    })

    it('isOption should validate instances of Some or None', () => {
      expect(option.isOption(someValue)).toBe(true)
      expect(option.isOption(noneValue)).toBe(true)
      expect(option.isOption('not-an-option')).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('retorna true para array vazio', () => {
      expect(option.isEmpty([])).toBe(true)
    })

    it('retorna true se todos são None', () => {
      expect(option.isEmpty([option.none(), option.none()])).toBe(true)
    })

    it('retorna false se algum é Some', () => {
      expect(option.isEmpty([option.none(), option.some(1)])).toBe(false)
    })
  })
})
