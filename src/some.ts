import { None } from './none'

import type { None as INone, Option, Some as ISome } from './types'

export class Some<T> implements ISome<T> {
  readonly _tag = 'Some'
  readonly value: T

  constructor(value: T) {
    this.value = value
  }

  isSome(): this is Some<T> {
    return true
  }

  isNone(): this is INone {
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

  unwrapOr<U>(_defaultValue: U): T {
    return this.value
  }

  unwrapOrElse<U>(_fn: () => U): T {
    return this.value
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some(fn(this.value))
  }

  mapOr<U>(fn: (value: T) => U, _defaultValue: U): U {
    return fn(this.value)
  }

  mapOrElse<U>(fn: (value: T) => U, _defaultFn: () => U): U {
    return fn(this.value)
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value)
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.value) ? this : None
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

  inspect(fn: (value: T) => void): Option<T> {
    fn(this.value)
    return this
  }

  flatten<U>(this: Some<Option<U>>): Option<U> {
    return this.value
  }

  toNullable(): T {
    return this.value
  }

  toUndefined(): T {
    return this.value
  }
}
