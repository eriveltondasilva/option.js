import type { None as _None, Option, Some } from './types';
import type { MatchCases } from './types/methods';

import { TAG } from './brand';
import { NoneUnwrapError } from './utils';

class NoneClass implements _None {
  readonly _tag = TAG.None;

  // #region Type Guards

  isSome(): this is Some<never> {
    return false;
  }

  isNone(): this is _None {
    return true;
  }

  isSomeAnd(_condition: (value: never) => boolean): boolean {
    return false;
  }

  isNoneOr(_condition: (value: never) => boolean): boolean {
    return true;
  }

  // #endregion

  // #region Extraction

  unwrap(): never {
    throw new NoneUnwrapError();
  }

  expect(reason: string): never {
    throw new NoneUnwrapError(reason);
  }

  unwrapOr<U>(defaultValue: U): U {
    return defaultValue;
  }

  unwrapOrElse<U>(fn: () => U): U {
    return fn();
  }

  // #endregion

  // #region Transformation

  map<U>(_fn: (value: never) => U): this {
    return this;
  }

  mapOr<U>(_fn: (value: never) => U, defaultValue: U): U {
    return defaultValue;
  }

  mapOrElse<U>(_fn: (value: never) => U, defaultFn: () => U): U {
    return defaultFn();
  }

  filter(_predicate: (value: never) => boolean): this {
    return this;
  }

  flatten(): this {
    return this;
  }

  // #endregion

  // #region Alternation

  and<U>(_other: Option<U>): this {
    return this;
  }

  andThen<U>(_fn: (value: never) => Option<U>): this {
    return this;
  }

  or<U>(other: Option<U>): Option<U> {
    return other;
  }

  orElse<U>(fn: () => Option<U>): Option<U> {
    return fn();
  }

  // #endregion

  // #region Combination

  zip<U>(_other: Option<U>): Option<[never, U]> {
    return this;
  }

  zipWith<U, R>(_other: Option<U>, _fn: (a: never, b: U) => R): Option<R> {
    return this;
  }

  // #endregion

  // #region Inspection

  match<U>(cases: MatchCases<never, U>): U {
    return cases.none();
  }

  inspect(_fn: (value: never) => void): this {
    return this;
  }

  tap(_fn: (value: never) => void): this {
    return this;
  }

  // #endregion

  // #region Conversion

  toNullable(): null {
    return null;
  }

  toUndefined(): undefined {
    return undefined;
  }

  toString(): string {
    return 'None';
  }

  toJSON(): { type: 'none'; value: undefined } {
    return {
      type: 'none',
      value: undefined,
    };
  }

  // #endregion
}

// # Singleton — None é imutável e não carrega estado
export const None = new NoneClass();
