import { describe, expect, it } from 'bun:test'

import { NoneUnwrapError } from './errors'
import { Option } from './option'

describe('Option.Some', () => {
  it('should return the wrapped value', () => {
    expect(Option.Some(42).unwrap()).toBe(42)
  })

  it('should map correctly', () => {
    expect(
      Option.Some(10)
        .map((v) => v * 2)
        .unwrap(),
    ).toBe(20)
  })

  it('should chain with flatMap', () => {
    const result = Option.Some(5)
      .flatMap((v) => (v > 3 ? Option.Some(v * 10) : Option.None))
      .unwrap()
    expect(result).toBe(50)
  })

  it('should match some branch', () => {
    const result = Option.Some('hello').match({
      some: (v) => `got: ${v}`,
      none: () => 'nothing',
    })
    expect(result).toBe('got: hello')
  })
})

describe('Option.None', () => {
  it('should throw on unwrap', () => {
    expect(() => Option.None.unwrap()).toThrow(NoneUnwrapError)
  })

  it('should return default on unwrapOr', () => {
    expect(Option.None.unwrapOr(99)).toBe(99)
  })

  it('should match none branch', () => {
    const result = Option.None.match({
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
