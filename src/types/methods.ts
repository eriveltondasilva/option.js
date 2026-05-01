import type { None, Option, Some } from '.';

/**
 * Represents the cases for matching an option.
 *
 * @template TValue - The type of the contained value.
 * @template TOption - The type of the option.
 *
 * @see {@link OptionMethods.match}
 *
 * @example
 * const cases: MatchCases<number, string> = {
 *   some: (val) => `Some(${val})`,
 *   none: () => 'None'
 * }
 */
export type MatchCases<TValue, TOption> = {
  /**
   * The handler to execute if the option is `Some`.
   *
   * @see {@link OptionMethods.match} - for using the `MatchCases` type.
   *
   * @param value - The value contained in the `Some` option.
   * @returns {TOption} - The result of the handler.
   */
  some: (value: TValue) => TOption;

  /**
   * The handler to execute if the option is `None`.
   *
   * @see {@link OptionMethods.match} - for using the `MatchCases` type.
   *
   * @returns {TOption} - The result of the handler.
   */
  none: () => TOption;
};

/**
 * A collection of methods for working with Options.
 *
 * @template TValue - The type of the contained value.
 */
export interface OptionMethods<TValue> {
  // #region Type Guards

  /**
   * Returns `true` when this option is a {@link Some} value.
   *
   * @group Type Guards
   *
   * @see {@link isNone} - for checking if value is None
   *
   * @example
   * Option.some(2).isSome() // => true
   * Option.none().isSome()  // => false
   */
  isSome(): this is Some<TValue>;

  /**
   * Returns `true` when this option is a {@link None} value.
   *
   * @group Type Guards
   *
   * @see {@link isSome} - for checking if value is Some
   *
   * @example
   * Option.none().isNone()  // => true
   * Option.some(2).isNone() // => false
   */
  isNone(): this is None;

  /**
   * Returns `true` when this option is a {@link Some} and the value matches the predicate.
   *
   * @group Type Guards
   *
   * @see {@link isNone} - for checking if value is None
   *
   * @param condition - The function to evaluate the contained value.
   *
   * @example
   * Option.some(2).isSomeAnd((v) => v > 1) // => true
   * Option.some(1).isSomeAnd((v) => v > 1) // => false
   */
  isSomeAnd(condition: (value: TValue) => boolean): boolean;

  /**
   * Returns `true` if the option is a `None`, or if it is a `Some` and the value matches the predicate.
   *
   * @group Type Guards
   *
   * @param condition - The function to evaluate the contained value.
   *
   * @example
   * Option.some(2).isNoneOr((v) => v > 1) // => true
   * Option.some(1).isNoneOr((v) => v > 1) // => false
   */
  isNoneOr(condition: (value: TValue) => boolean): boolean;

  // #endregion

  // #region Extraction

  /**
   * Returns the contained `Some` value.
   *
   * @group Extraction
   *
   * @returns {TValue} the contained value
   * @throws {NoneUnwrapError} if the value is None
   *
   * @example
   * Option.some(42).unwrap() // => 42
   * Option.none().unwrap()
   * // => throws NoneUnwrapError('...')
   */
  unwrap(): TValue;

  /**
   * Returns the contained `Some` value.
   *
   * @group Extraction
   *
   * @param reason - A custom error message provided if the value is `None`.
   * @throws {NoneUnwrapError} If the value is `None`, with the provided custom message.
   *
   * @example
   * Option.some(42).expect('Custom error message') // => 42
   * Option.none().expect('Custom error message')
   * // => throws NoneUnwrapError('Custom error message')
   */
  expect(reason: string): TValue;

  /**
   * Returns the contained `Some` value or a provided default.
   *
   * @group Extraction
   *
   * @template U
   * @param defaultValue - The default value to return if the option is `None`.
   *
   * @example
   * Option.some(42).unwrapOr(99) // => 42
   * Option.none().unwrapOr(99)   // => 99
   */
  unwrapOr<U>(defaultValue: U): TValue | U;

  /**
   * Returns the contained `Some` value or computes it from a closure.
   *
   * @group Extraction
   *
   * @template U
   * @param fallback - The
   * function to execute if the option is `None`.
   *
   * @example
   * Option.some(42).unwrapOrElse(() => 99) // => 42
   * Option.none().unwrapOrElse(() => 99)     // => 99
   */
  unwrapOrElse<U = TValue>(fallback: () => U): TValue | U;

  // #endregion

  // #region Transformation

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function
   * to a contained `Some` value, leaving a `None` value untouched.
   *
   * @group Transformation
   *
   * @template U
   *
   * @param mapper - The function to apply to the contained value.
   *
   * @example
   * Option.some("Hello").map((s) => s.length) // => Some(5)
   * Option.none().map((s) => s.length)        // => None
   */
  map<U>(mapper: (value: TValue) => U): Option<U>;

  /**
   * Returns the provided default result (if `None`),
   * or applies a function to the contained value (if `Some`).
   *
   * @group Transformation
   *
   * @template U
   * @param mapper - The function to apply to the contained value.
   * @param defaultValue - The default fallback value.
   *
   * @example
   * Option.some("Hello").mapOr((s) => s.length, 0) // => 5
   * Option.none().mapOr((s) => s.length, 0)        // => 0
   */
  mapOr<U>(mapper: (value: TValue) => U, defaultValue: U): U;

  /**
   * Computes a default function result (if `None`),
   * or applies a different function to the contained value (if `Some`).
   *
   * @group Transformation
   *
   * @template U
   *
   * @param someMapper - The function to apply to the contained value.
   * @param noneMapper - The fallback function to compute a default value.
   *
   * @example
   * Option.some("Hello").mapOrElse((s) => s.length, () => 0) // => 5
   * Option.none().mapOrElse((s) => s.length, () => 0)        // => 0
   */
  mapOrElse<U>(someMapper: (value: TValue) => U, noneMapper: () => U): U;

  /**
   * Returns `None` if the option is `None`, otherwise calls the predicate with the wrapped value and returns:
   * - `Some(t)` if the predicate returns `true`
   * - `None` if the predicate returns `false`
   *
   * @group Transformation
   *
   * @param condition - The condition the inner value must satisfy.
   *
   * @example
   * Option.some(10).filter((val) => val > 5) // => Some(10)
   * Option.some(10).filter((val) => val > 15) // => None
   */
  filter(condition: (value: TValue) => boolean): Option<TValue>;

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * @group Transformation
   *
   * @template U
   *
   * @example
   * Option.some(Option.some(10)).flatten() // => Some(10)
   * Option.some(Option.none()).flatten()   // => None
   */
  flatten<U>(this: Option<Option<U>>): Option<U>;

  // #endregion

  // #region Alternation

  /**
   * Returns `None` if the option is `None`, otherwise returns the `other` option.
   *
   * @group Alternation
   *
   * @template U
   * @param other - The option to return if the current one is `Some`.
   *
   * @example
   * Option.some(10).and(Option.some(20)) // => Some(20)
   * Option.some(10).and(Option.none())   // => None
   */
  and<U>(other: Option<U>): Option<U>;

  /**
   * Returns `None` if the option is `None`, otherwise calls `fn` with the wrapped value and returns the result.
   * Often called "flatMap" or "bind" in other languages.
   *
   * @group Alternation
   *
   * @template U
   *
   * @param next - The function returning an Option to apply to the contained value.
   *
   * @example
   * Option.some(10).andThen((val) => Option.some(val + 10)) // => Some(20)
   * Option.some(10).andThen((val) => Option.none())         // => None
   */
  andThen<U>(next: (value: TValue) => Option<U>): Option<U>;

  /**
   * Returns the option if it contains a value, otherwise returns the `other` option.
   *
   * @group Alternation
   *
   * @template U
   *
   * @param other - The fallback option.
   *
   * @example
   * Option.some(10).or(Option.some(20)) // => Some(10)
   * Option.some(10).or(Option.none())   // => Some(10)
   */
  or<U>(other: Option<U>): Option<TValue | U>;

  /**
   * Returns the option if it contains a value, otherwise calls `fn` and returns the result.
   *
   * @group Alternation
   *
   * @template U
   *
   * @param fallback - The fallback function returning an Option.
   *
   * @example
   * Option.some(10).orElse(() => Option.some(20)) // => Some(10)
   * Option.some(10).orElse(() => Option.none())   // => Some(10)
   */
  orElse<U>(fallback: () => Option<U>): Option<TValue | U>;

  // #endregion

  // #region Combination

  /**
   * Zips the current option with another option, returning a tuple of their values if both are `Some`.
   *
   * @group Combination
   *
   * @template U
   * @param other - The other option to zip with.
   *
   * @example
   * Option.some(10).zip(Option.some(20)) // => Some([10, 20])
   * Option.some(10).zip(Option.none())   // => None
   */
  zip<U>(other: Option<U>): Option<[TValue, U]>;

  /**
   * Zips the current option with another option, applying the given function if both are `Some`.
   *
   * @group Combination
   *
   * @template U - The type of the second option.
   * @template R - The type of the result.
   *
   * @param other - The other option.
   * @param combine - The function to combine the two values.
   *
   * @example
   * Option.some(10).zipWith(Option.some(20), (a, b) => a + b) // => Some(30)
   * Option.some(10).zipWith(Option.none(), (a, b) => a + b)   // => None
   */
  zipWith<U, R>(other: Option<U>, combine: (value: TValue, otherValue: U) => R): Option<R>;

  // #endregion

  // #region Inspection

  /**
   * Pattern matches on the `Option`, executing the `some` or `none` handler based on its state.
   *
   * @group Inspection
   *
   * @template U
   * @param handlers - An object containing the `some` and `none` callback functions.
   *
   * @example
   * const val = Option.some(5).match({
   *   some: (val) => val * 2,
   *   none: () => 0
   * }); // => 10
   */
  match<U>(cases: MatchCases<TValue, U>): U;

  /**
   * Calls the provided closure with a reference to the contained value (if `Some`), and returns the original option.
   *
   * @group Inspection
   *
   * @param action - The function to execute for side-effects.
   *
   * @example
   * Option.some(10).inspect((val) => console.log('got: ' + val))
   * // => Some(10)
   */
  inspect(action: (value: TValue) => void): this;

  /**
   * Alias for `inspect`. Useful for side-effects in chaining.
   *
   * @group Inspection
   *
   * @param action - The function to execute for side-effects.
   *
   * @example
   * Option.some(10).tap((val) => console.log('got: ' + val))
   * // => Some(10)
   */
  tap(action: (value: TValue) => void): this;

  // #endregion

  // #region Conversion

  /**
   * Converts the Option into a nullable value (`T | null`).
   *
   * @group Conversion
   *
   * @example
   * Option.some(10).toNullable() // => 10
   * Option.none().toNullable()   // => null
   */
  toNullable(): TValue | null;

  /**
   * Converts the Option into an undefined value (`T | undefined`).
   *
   * @group Conversion
   *
   * @example
   * Option.some(10).toUndefined() // => 10
   * Option.none().toUndefined()   // => undefined
   */
  toUndefined(): TValue | undefined;

  /**
   * Returns a string representation of the Option.
   *
   * @group Conversion
   *
   * @example
   * Option.some(10).toString() // => 'Some(10)'
   * Option.none().toString()   // => 'None'
   */
  toString(): string;

  // #endregion
}
