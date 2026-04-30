export interface OptionMethods<T> {
  // #region Type Guards

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @group Type Guards
   *
   * @returns {boolean}
   *
   * @example
   * Option.some(2).isSome() // => true
   * Option.none().isSome()  // => false
   */
  isSome(): this is ISome<T>;

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @group Type Guards
   *
   * @returns {boolean}
   *
   * @example
   * Option.none().isNone()  // => true
   * Option.some(2).isNone() // => false
   */
  isNone(): this is INone;

  /**
   * Returns `true` if the option is a `Some` and the value inside matches the predicate.
   *
   * @group Type Guards
   *
   * @param predicate - The function to evaluate the contained value.
   * @returns {boolean}
   *
   * @example
   * Option.some(2).isSomeAnd((v) => v > 1) // => true
   * Option.some(1).isSomeAnd((v) => v > 1) // => false
   */
  isSomeAnd(predicate: (value: T) => boolean): boolean;

  /**
   * Returns `true` if the option is a `None`, or if it is a `Some` and the value matches the predicate.
   *
   * @group Type Guards
   *
   * @param predicate - The function to evaluate the contained value.
   * @returns {boolean}
   *
   * @example
   * Option.some(2).isNoneOr((v) => v > 1) // => false
   * Option.some(1).isNoneOr((v) => v > 1) // => true
   */
  isNoneOr(predicate: (value: T) => boolean): boolean;

  // #endregion

  // #region Extraction

  /**
   * Returns the contained `Some` value.
   *
   * @group Extraction
   *
   * @returns {T} the contained value
   * @throws {NoneUnwrapError} if the value is None
   *
   * @example
   * Option.some(42).unwrap() // => 42
   * Option.none().unwrap()
   * // => throws NoneUnwrapError('...')
   */
  unwrap(): T;

  /**
   * Returns the contained `Some` value.
   *
   * @group Extraction
   *
   * @param message - A custom error message provided if the value is `None`.
   * @returns {T} The contained value.
   * @throws {NoneUnwrapError} If the value is `None`, with the provided custom message.
   *
   * @example
   * Option.some(42).expect('Custom error message') // => 42
   * Option.none().expect('Custom error message')
   * // => throws NoneUnwrapError('Custom error message')
   */
  expect(message: string): T;

  /**
   * Returns the contained `Some` value or a provided default.
   *
   * @group Extraction
   *
   * @template U
   * @param defaultValue - The default value to return if the option is `None`.
   * @returns {T | U}
   *
   * @example
   * Option.some(42).unwrapOr(99) // => 42
   * Option.none().unwrapOr(99)   // => 99
   */
  unwrapOr<U>(defaultValue: U): T | U;

  /**
   * Returns the contained `Some` value or computes it from a closure.
   *
   * @group Extraction
   *
   * @template U
   * @param fn - The function to execute if the option is `None`.
   * @returns {T | U}
   *
   * @example
   * Option.some(42).unwrapOrElse(() => 99) // => 42
   * Option.none().unwrapOrElse(() => 99)     // => 99
   */
  unwrapOrElse<U>(fn: () => U): T | U;

  // #endregion

  // #region Transformation

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function
   * to a contained `Some` value, leaving a `None` value untouched.
   *
   * @group Transformation
   *
   * @template U
   * @param fn - The function to apply to the contained value.
   * @returns {IOption<U>}
   *
   * @example
   * Option.some("Hello").map((s) => s.length) // => Some(5)
   * Option.none().map((s) => s.length)        // => None
   */
  map<U>(fn: (value: T) => U): IOption<U>;

  /**
   * Returns the provided default result (if `None`),
   * or applies a function to the contained value (if `Some`).
   *
   * @group Transformation
   *
   * @template U
   * @param fn - The function to apply to the contained value.
   * @param defaultValue - The default fallback value.
   * @returns {U}
   *
   * @example
   * Option.some("Hello").mapOr((s) => s.length, 0) // => 5
   * Option.none().mapOr((s) => s.length, 0)        // => 0
   */
  mapOr<U>(fn: (value: T) => U, defaultValue: U): U;

  /**
   * Computes a default function result (if `None`),
   * or applies a different function to the contained value (if `Some`).
   *
   * @group Transformation
   *
   * @template U
   * @param fn - The function to apply to the contained value.
   * @param defaultFn - The fallback function to compute a default value.
   * @returns {U}
   *
   * @example
   * Option.some("Hello").mapOrElse((s) => s.length, () => 0) // => 5
   * Option.none().mapOrElse((s) => s.length, () => 0)        // => 0
   */
  mapOrElse<U>(fn: (value: T) => U, defaultFn: () => U): U;

  /**
   * Returns `None` if the option is `None`, otherwise calls the predicate with the wrapped value and returns:
   * - `Some(t)` if the predicate returns `true`
   * - `None` if the predicate returns `false`
   *
   * @group Transformation
   *
   * @param predicate - The condition the inner value must satisfy.
   * @returns {IOption<T>}
   *
   * @example
   * Option.some(10).filter((val) => val > 5) // => Some(10)
   * Option.some(10).filter((val) => val > 15) // => None
   */
  filter(predicate: (value: T) => boolean): IOption<T>;

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * @group Transformation
   *
   * @template U
   * @returns {IOption<U>}
   *
   * @example
   * Option.some(Option.some(10)).flatten() // => Some(10)
   * Option.some(Option.none()).flatten()   // => None
   */
  flatten(this: IOption<IOption<T>>): IOption<T>;

  // #endregion

  // #region Alternation

  /**
   * Returns `None` if the option is `None`, otherwise returns the `other` option.
   *
   * @group Alternation
   *
   * @template U
   * @param other - The option to return if the current one is `Some`.
   * @returns {IOption<U>}
   *
   * @example
   * Option.some(10).and(Option.some(20)) // => Some(20)
   * Option.some(10).and(Option.none())   // => None
   */
  and<U>(other: IOption<U>): IOption<U>;

  /**
   * Returns `None` if the option is `None`, otherwise calls `fn` with the wrapped value and returns the result.
   * Often called "flatMap" or "bind" in other languages.
   *
   * @group Alternation
   *
   * @template U
   * @param fn - The function returning an Option to apply to the contained value.
   * @returns {IOption<U>}
   *
   * @example
   * Option.some(10).andThen((val) => Option.some(val + 10)) // => Some(20)
   * Option.some(10).andThen((val) => Option.none())         // => None
   */
  andThen<U>(fn: (value: T) => IOption<U>): IOption<U>;

  /**
   * Returns the option if it contains a value, otherwise returns the `other` option.
   *
   * @group Alternation
   *
   * @template U
   * @param other - The fallback option.
   * @returns {IOption<T | U>}
   *
   * @example
   * Option.some(10).or(Option.some(20)) // => Some(10)
   * Option.some(10).or(Option.none())   // => Some(10)
   */
  or<U>(other: IOption<U>): IOption<T | U>;

  /**
   * Returns the option if it contains a value, otherwise calls `fn` and returns the result.
   *
   * @group Alternation
   *
   * @template U
   * @param fn - The fallback function returning an Option.
   * @returns {IOption<T | U>}
   *
   * @example
   * Option.some(10).orElse(() => Option.some(20)) // => Some(10)
   * Option.some(10).orElse(() => Option.none())   // => Some(10)
   */
  orElse<U>(fn: () => IOption<U>): IOption<T | U>;

  // #endregion

  // #region Combination

  /**
   * Zips the current option with another option, returning a tuple of their values if both are `Some`.
   *
   * @group Combination
   *
   * @template U
   * @param other - The other option to zip with.
   * @returns {IOption<[T, U]>}
   *
   * @example
   * Option.some(10).zip(Option.some(20)) // => Some([10, 20])
   * Option.some(10).zip(Option.none())   // => None
   */
  zip<U>(other: IOption<U>): IOption<[T, U]>;

  /**
   * Zips the current option with another option, applying the given function if both are `Some`.
   *
   * @group Combination
   *
   * @template U, R
   * @param other - The other option.
   * @param fn - The function to combine the two values.
   * @returns {IOption<R>}
   *
   * @example
   * Option.some(10).zipWith(Option.some(20), (a, b) => a + b) // => Some(30)
   * Option.some(10).zipWith(Option.none(), (a, b) => a + b)   // => None
   */
  zipWith<U, R>(other: IOption<U>, fn: (a: T, b: U) => R): IOption<R>;

  // #endregion

  // #region Inspection

  /**
   * Pattern matches on the `Option`, executing the `some` or `none` handler based on its state.
   *
   * @group Inspection
   *
   * @template U
   * @param handlers - An object containing the `some` and `none` callback functions.
   * @returns {U}
   *
   * @example
   * const val = Option.some(5).match({
   *   some: (val) => val * 2,
   *   none: () => 0
   * }); // => 10
   */
  match<U>(handlers: { some: (value: T) => U; none: () => U }): U;

  /**
   * Calls the provided closure with a reference to the contained value (if `Some`), and returns the original option.
   *
   * @group Inspection
   *
   * @param fn - The function to execute for side-effects.
   * @returns {IOption<T>}
   *
   * @example
   * Option.some(10).inspect((val) => console.log('got: ' + val))
   * // => Some(10)
   */
  inspect(fn: (value: T) => void): IOption<T>;

  /**
   * Alias for `inspect`. Useful for side-effects in chaining.
   *
   * @group Inspection
   *
   * @param fn - The function to execute for side-effects.
   * @returns {IOption<T>}
   *
   * @example
   * Option.some(10).tap((val) => console.log('got: ' + val))
   * // => Some(10)
   */
  tap(fn: (value: T) => void): IOption<T>;

  // #endregion

  // #region Conversion

  /**
   * Converts the Option into a nullable value (`T | null`).
   *
   * @group Conversion
   *
   * @returns {T | null}
   *
   * @example
   * Option.some(10).toNullable() // => 10
   * Option.none().toNullable()   // => null
   */
  toNullable(): T | null;

  /**
   * Converts the Option into an undefined value (`T | undefined`).
   *
   * @group Conversion
   *
   * @returns {T | undefined}
   *
   * @example
   * Option.some(10).toUndefined() // => 10
   * Option.none().toUndefined()   // => undefined
   */
  toUndefined(): T | undefined;

  // TODO: implement these methods
  // toString(): string
  // toValue(): T
  // toJSON(): T

  // #endregion
}

/**
 * Represents an option that contains a value.
 *
 * @template T
 */
export interface ISome<T> extends OptionMethods<T> {
  readonly _tag: 'Some';
}

/**
 * Represents an option that does not contain a value.
 */
export interface INone extends OptionMethods<never> {
  readonly _tag: 'None';
}

/**
 * Represents an option that may or may not contain a value.
 *
 * @template T
 */
export type IOption<T> = ISome<T> | INone;

/**
 * Represents an async option that may or may not contain a value.
 *
 * @template T
 */
export type IAsyncOption<T> = Promise<IOption<T>>;
