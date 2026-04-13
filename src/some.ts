import { none } from './none'

import type { None, Option, Some as ISome } from './types'

export class Some<T> implements ISome<T> {
  readonly _tag = 'Some'
  readonly value: T

  constructor(value: T) {
    this.value = value
  }

  isSome(): this is Some<T> {
    return true
  }

  isNone(): this is None {
    return false
  }

  isSomeAnd(predicate: (value: T) => boolean): boolean {
    return predicate(this.value)
  }

  isNoneOr(predicate: (value: T) => boolean): boolean {
    return predicate(this.value)
  }

  unwrap(): T {
    return this.value
  }

  expect(_message: string): T {
    return this.value
  }

  unwrapOr(_defaultValue: unknown): T {
    return this.value
  }

  unwrapOrElse(_fn: () => unknown): T {
    return this.value
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some(fn(this.value))
  }

  mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
    return fn(this.value)
  }

  mapOrElse<U>(_defaultFn: () => U, fn: (value: T) => U): U {
    return fn(this.value)
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value)
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.value) ? this : none
  }

  or<U>(_other: Option<U>): Option<T> {
    return this
  }

  orElse<U>(_fn: () => Option<U>): Option<T> {
    return this
  }

  match<U>(patterns: { some: (value: T) => U; none: () => U }): U {
    return patterns.some(this.value)
  }

  toNullable(): T {
    return this.value
  }

  toUndefined(): T {
    return this.value
  }
}
