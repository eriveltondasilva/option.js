import { NoneClass as None } from './none'

import type { None as INone, Option as IOption, Some as ISome } from './types'

export class Some<T> implements ISome<T> {
  readonly _tag = 'Some'
  readonly #value: T

  constructor(value: T) {
    this.#value = value
  }

  // #region Type Guards

  isSome(): this is ISome<T> {
    return true
  }

  isNone(): this is INone {
    return false
  }

  isSomeAnd(predicate: (value: T) => boolean): boolean {
    return predicate(this.#value)
  }

  isNoneOr(predicate: (value: T) => boolean): boolean {
    return predicate(this.#value)
  }

  // #endregion

  // #region Extraction

  unwrap(): T {
    return this.#value
  }

  expect(_message: string): T {
    return this.#value
  }

  unwrapOr<U>(_defaultValue: U): T {
    return this.#value
  }

  unwrapOrElse<U>(_fn: () => U): T {
    return this.#value
  }

  // #endregion

  // #region Transformation

  map<U>(fn: (value: T) => U): IOption<U> {
    return new Some(fn(this.#value))
  }

  mapOr<U>(fn: (value: T) => U, _defaultValue: U): U {
    return fn(this.#value)
  }

  mapOrElse<U>(fn: (value: T) => U, _defaultFn: () => U): U {
    return fn(this.#value)
  }

  filter(predicate: (value: T) => boolean): IOption<T> {
    return predicate(this.#value) ? this : None
  }

  flatten<U>(this: Some<IOption<U>>): IOption<U> {
    return this.#value
  }

  // #endregion

  // #region Alternation

  and<U>(other: IOption<U>): IOption<U> {
    return other
  }

  andThen<U>(fn: (value: T) => IOption<U>): IOption<U> {
    return fn(this.#value)
  }

  or<U>(_other: IOption<U>): this {
    return this
  }

  orElse<U>(_fn: () => IOption<U>): this {
    return this
  }

  // #endregion

  // #region Combination

  zip<U>(other: IOption<U>): IOption<[T, U]> {
    return other.isSome() ? new Some<[T, U]>([this.#value, other.unwrap()]) : None
  }

  zipWith<U, R>(other: IOption<U>, fn: (a: T, b: U) => R): IOption<R> {
    return other.isSome() ? new Some(fn(this.#value, other.unwrap())) : None
  }

  // #endregion

  // #region Inspection

  match<U>(handlers: { some: (value: T) => U; none: () => U }): U {
    return handlers.some(this.#value)
  }

  inspect(fn: (value: T) => void): this {
    fn(this.#value)

    return this
  }

  tap(fn: (value: T) => void): this {
    return this.inspect(fn)
  }

  // #endregion

  // #region Conversion

  toNullable(): T {
    return this.#value
  }

  toUndefined(): T {
    return this.#value
  }

  // #endregion
}
