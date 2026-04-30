import type { INone, IOption, ISome } from './types.ts';

import { NoneUnwrapError } from './errors.ts';

class None implements INone {
  readonly _tag = 'None';

  // #region Type Guards

  isSome(): this is ISome<never> {
    return false;
  }

  isNone(): this is INone {
    return true;
  }

  isSomeAnd(_predicate: (value: never) => boolean): boolean {
    return false;
  }

  isNoneOr(_predicate: (value: never) => boolean): boolean {
    return true;
  }

  // #endregion

  // #region Extraction

  unwrap(): never {
    throw new NoneUnwrapError();
  }

  expect(message: string): never {
    throw new NoneUnwrapError(message);
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

  and<U>(_other: IOption<U>): this {
    return this;
  }

  andThen<U>(_fn: (value: never) => IOption<U>): this {
    return this;
  }

  or<U>(other: IOption<U>): IOption<U> {
    return other;
  }

  orElse<U>(fn: () => IOption<U>): IOption<U> {
    return fn();
  }

  // #endregion

  // #region Combination

  zip<U>(_other: IOption<U>): IOption<[never, U]> {
    return this;
  }

  zipWith<U, R>(_other: IOption<U>, _fn: (a: never, b: U) => R): IOption<R> {
    return this;
  }

  // #endregion

  // #region Inspection

  match<U>(handlers: { some: (value: never) => U; none: () => U }): U {
    return handlers.none();
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

  // #endregion
}

// # Singleton — None é imutável e não carrega estado
export const NoneClass = new None();
