import type { None as _None, Some as _Some, Option } from './types';
import type { MatchCases } from './types/methods';

import { TAG } from './brand';
import { NONE } from './none';
import { formatForDisplay } from './utils';

export class Some<T> implements _Some<T> {
  readonly _tag = TAG.Some;
  readonly #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  // #region Type Guards

  isSome(): this is _Some<T> {
    return true;
  }

  isNone(): this is _None {
    return false;
  }

  isSomeAnd(condition: (value: T) => boolean): boolean {
    return condition(this.#value);
  }

  isNoneOr(condition: (value: T) => boolean): boolean {
    return condition(this.#value);
  }

  // #endregion

  // #region Extraction

  unwrap(): T {
    return this.#value;
  }

  expect(_message: string): T {
    return this.#value;
  }

  unwrapOr<U>(_defaultValue: U): T {
    return this.#value;
  }

  unwrapOrElse<U>(_fn: () => U): T {
    return this.#value;
  }

  // #endregion

  // #region Transformation

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some(fn(this.#value));
  }

  mapOr<U>(fn: (value: T) => U, _defaultValue: U): U {
    return fn(this.#value);
  }

  mapOrElse<U>(fn: (value: T) => U, _defaultFn: () => U): U {
    return fn(this.#value);
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.#value) ? this : NONE;
  }

  flatten<U>(this: _Some<Option<U>>): Option<U> {
    return this.unwrap();
  }

  // #endregion

  // #region Alternation

  and<U>(other: Option<U>): Option<U> {
    return other;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.#value);
  }

  or<U>(_other: Option<U>): this {
    return this;
  }

  orElse<U>(_fn: () => Option<U>): this {
    return this;
  }

  // #endregion

  // #region Combination

  zip<U>(other: Option<U>): Option<[T, U]> {
    return other.isSome() ? new Some<[T, U]>([this.#value, other.unwrap()]) : NONE;
  }

  zipWith<U, R>(other: Option<U>, fn: (value: T, otherValue: U) => R): Option<R> {
    return other.isSome() ? new Some(fn(this.#value, other.unwrap())) : NONE;
  }

  // #endregion

  // #region Inspection

  match<U>(cases: MatchCases<T, U>): U {
    return cases.some(this.#value);
  }

  inspect(fn: (value: T) => void): this {
    fn(this.#value);

    return this;
  }

  tap(fn: (value: T) => void): this {
    return this.inspect(fn);
  }

  // #endregion

  // #region Conversion

  toNullable(): T {
    return this.#value;
  }

  toUndefined(): T {
    return this.#value;
  }

  toString(): string {
    return `Some(${formatForDisplay(this.#value)})`;
  }

  toJSON(): { type: 'some'; value: T } {
    return {
      type: 'some',
      value: this.#value,
    };
  }

  // #endregion
}
