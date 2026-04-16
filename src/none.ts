import { NoneUnwrapError } from './errors'

import type { None as INone, Option, Some } from './types'

class None implements INone {
  readonly _tag = 'None'

  isSome(): this is Some<never> {
    return false
  }

  isNone(): this is INone {
    return true
  }

  isSomeAnd(_predicate: (value: never) => boolean): boolean {
    return false
  }

  isNoneOr(_predicate: (value: never) => boolean): boolean {
    return true
  }

  unwrap(): never {
    throw new NoneUnwrapError()
  }

  expect(message: string): never {
    throw new NoneUnwrapError(message)
  }

  unwrapOr<U>(defaultValue: U): U {
    return defaultValue
  }

  unwrapOrElse<U>(fn: () => U): U {
    return fn()
  }

  map<U>(_fn: (value: never) => U): Option<U> {
    return this
  }

  mapOr<U>(_fn: (value: never) => U, defaultValue: U): U {
    return defaultValue
  }

  mapOrElse<U>(_fn: (value: never) => U, defaultFn: () => U): U {
    return defaultFn()
  }

  and<U>(_other: Option<U>): Option<U> {
    return this as unknown as Option<U>
  }

  andThen<U>(_fn: (value: never) => Option<U>): Option<U> {
    return this
  }

  filter(_predicate: (value: never) => boolean): Option<never> {
    return this
  }

  or<U>(other: Option<U>): Option<U> {
    return other
  }

  orElse<U>(fn: () => Option<U>): Option<U> {
    return fn()
  }

  match<U>(patterns: { some: (value: never) => U; none: () => U }): U {
    return patterns.none()
  }

  inspect(_fn: (value: never) => void): Option<never> {
    return this
  }

  flatten(): Option<never> {
    return this
  }

  toNullable(): null {
    return null
  }
}

// Singleton — None é imutável e não carrega estado
export const NoneClass = new None()
