import { describe, expect, it } from 'vitest'

import { NoneUnwrapError } from './errors'
import { Option } from './option'

describe('Option.Some', () => {
  it('should return the wrapped value', () => {
    expect(Option.some(42).unwrap()).toBe(42)
  })

  it('should map correctly', () => {
    expect(
      Option.some(10)
        .map((v) => v * 2)
        .unwrap(),
    ).toBe(20)
  })

  it('should chain with andThan', () => {
    const result = Option.some(5)
      .andThen((v) => (v > 3 ? Option.some(v * 10) : Option.none))
      .unwrap()
    expect(result).toBe(50)
  })

  it('should match some branch', () => {
    const result = Option.some('hello').match({
      some: (val) => `got: ${val}`,
      none: () => 'nothing',
    })
    expect(result).toBe('got: hello')
  })
})

describe('Option.None', () => {
  it('should throw on unwrap', () => {
    expect(() => Option.none.unwrap()).toThrow(NoneUnwrapError)
  })

  it('should return default on unwrapOr', () => {
    expect(Option.none.unwrapOr(99)).toBe(99)
  })

  it('should match none branch', () => {
    const result = Option.none.match({
      some: (v: never) => v,
      none: () => 'empty',
    })
    expect(result).toBe('empty')
  })
})

describe('Option.from', () => {
  it('should create Some from value', () => {
    expect(Option.from('hello').isSome()).toBe(true)
  })

  it('should create None from null', () => {
    expect(Option.from(null).isNone()).toBe(true)
  })

  it('should create None from undefined', () => {
    expect(Option.from(undefined).isNone()).toBe(true)
  })
})
