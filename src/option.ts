import type { None as _None, Some as _Some, AsyncOption, Option } from './types';

import { TAG } from './brand';
import { NONE } from './none';
import { Some } from './some';
import { isEmptyArray, ResultTypeError } from './utils';

// #region Type Guards

/**
 * Checks if option is Some<T>
 *
 * @group Type Guards
 *
 * @see {@link isNone} - for checking if value is None
 * @see {@link isOption} - for checking if value is Option
 *
 * @param value - The value to check.
 *
 * @example
 * Option.isSome(Option.some(42)) // => true
 * Option.isSome(Option.none())   // => false
 */
function isSome(value: unknown): value is _Some<unknown> {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === TAG.Some;
}

/**
 * Checks if option is None
 *
 * @group Type Guards
 *
 * @see {@link isSome} - for checking if value is Some
 * @see {@link isOption} - for checking if value is Option
 *
 * @param value - The value to check.
 *
 * @example
 * Option.isNone(Option.none())   // => true
 * Option.isNone(Option.some(42)) // => false
 */
function isNone(value: unknown): value is _None {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === TAG.None;
}

/**
 * Checks if value is Option<unknown>
 *
 * @group Type Guards
 *
 * @see {@link isSome} - for checking if value is Some
 * @see {@link isNone} - for checking if value is None
 *
 * @param value - The value to check.
 *
 * @example
 * Option.isOption(Option.some(42)) // => true
 * Option.isOption(Option.none())   // => true
 */
function isOption(value: unknown): value is Option<unknown> {
  return (
    value != null &&
    typeof value === 'object' &&
    '_tag' in value &&
    (value._tag === TAG.Some || value._tag === TAG.None)
  );
}

// #endregion

// #region Creation

/**
 * Creates an Option from a value.
 *
 * @group Creation
 *
 * @see {@link none} - for creating an empty Option
 * @see {@link fromTry} - for creating an Option
 *
 * @template TValue - The type of the value.
 *
 * @param value - The value to create an Option from.
 *
 * @example
 * Option.some(42)                 // => Some(42)
 * Option.some('hello')            // => Some('hello')
 * Option.some({ value: 'hello' }) // => Some({ value: 'hello' })
 */
function some<TValue>(value: TValue): _Some<TValue> {
  return new Some(value);
}

/**
 * Creates an empty Option.
 *
 * @group Creation
 *
 * @see {@link some} - for creating an Option with a value
 * @see {@link fromTry} - for creating an Option
 *
 * @example
 * Option.none() // => None
 */
function none<T = never>(): Option<T> {
  return NONE;
}

/**
 * Creates an Option from a function.
 *
 * @group Creation
 *
 * @see {@link some} - for creating an Option with a value
 * @see {@link fromPromise} - for creating an AsyncOption
 *
 * @template TValue - The type of the value.
 *
 * @param fn - The function to execute and create an Option from.
 *
 * @example
 * Option.fromTry(() => 42)
 * // => Some(42)
 * Option.fromTry(() => throw new Error('error'))
 * // => None
 */
function fromTry<TValue>(fn: () => TValue): Option<TValue> {
  try {
    return new Some(fn());
  } catch {
    return NONE;
  }
}

/**
 * Creates an AsyncOption from a function.
 *
 * @group Creation
 *
 * @see {@link some} - for creating an Option with a value
 * @see {@link fromTry} - for creating an Option
 *
 * @template TValue - The type of the value.
 *
 * @param fn - The function to execute and create an Option from.
 *
 * @example
 * Option.fromPromise(async () => 42)
 * // => Some(42)
 * Option.fromPromise(async () => throw new Error('error'))
 * // => None
 */
async function fromPromise<TValue>(fn: () => Promise<TValue>): AsyncOption<TValue> {
  try {
    return new Some(await fn());
  } catch {
    return NONE;
  }
}

/**
 * Creates an Option from a nullable value.
 *
 * @group Creation
 *
 * @see {@link some} - for creating an Option with a value
 * @see {@link fromTry} - for creating an Option
 *
 * @template TValue - The type of the value.
 *
 * @param value - The nullable value to create an Option from.
 *
 * @example
 * Option.fromNullable(42)        // => Some(42)
 * Option.fromNullable(null)      // => None
 * Option.fromNullable(undefined) // => None
 */
function fromNullable<TValue>(value: TValue | null | undefined): Option<NonNullable<TValue>> {
  return value == null ? NONE : new Some(value);
}

/**
 * Creates an Option from a value and a predicate.
 *
 * @group Creation
 *
 * @see {@link some} - for creating an Option with a value
 * @see {@link fromTry} - for creating an Option
 *
 * @template TValue - The type of the value.
 *
 * @param value - The value to validate.
 * @param fn - The predicate to validate the value.
 *
 * @example
 * Option.validate(42, (val) => val > 10) // => Some(42)
 * Option.validate(5, (val) => val > 10)  // => None
 */
function validate<TValue>(value: TValue, fn: (value: TValue) => boolean): Option<TValue> {
  return fn(value) ? new Some(value) : NONE;
}

// #endregion

// #region Collection

/**
 * Creates an Option from an array of Options.
 *
 * @group Collection
 *
 * @see {@link collect} - for creating an array
 * @see {@link values} - for creating an array
 *
 * @param options - An array of Options to extract values from.
 * @throws {Error} - If array contains non-Option values
 *
 * @example
 * Option.all([Option.some(1), Option.some(2), Option.some(3)])
 * // => Some([1, 2, 3])
 * Option.all([]) // => Some([])
 *
 * // If any option is None, the result is None
 * Option.all([Option.some(1), Option.some(2), Option.none()])
 * // => None
 *
 * Option.all(['non-option'])
 * // => Error('...')
 */
function all<TOption>(options: Option<TOption>[]): Option<TOption[]> {
  if (isEmptyArray(options)) {
    return new Some([]);
  }

  const someValues: TOption[] = [];

  for (const [i, option] of options.entries()) {
    if (!isOption(option)) {
      throw new ResultTypeError(
        `Option.all() | Option.collect() received an invalid value at index [${i}]: expected a Option, got "${typeof option}"`,
        option,
      );
    }

    if (option.isNone()) {
      return NONE;
    }

    someValues.push(option.unwrap());
  }

  return new Some(someValues);
}

/**
 * Creates an array from an array of Options.
 *
 * @remarks
 * Alias for `all`
 *
 * @group Collection
 *
 * @see {@link all} - for creating an array
 * @see {@link values} - for creating an array
 *
 * @template TOption - The type of the Option.
 *
 * @param options - An array of Options to extract values from.
 * @throws {Error} - If array contains non-Option values
 *
 * @example
 * Option.collect([Option.some(1), Option.some(2), Option.some(3)])
 * // => Some([1, 2, 3])
 * Option.collect([]) // => Some([])
 *
 * // If any option is None, the result is None
 * Option.collect([Option.some(1), Option.some(2), Option.none()])
 * // => None
 *
 * Option.collect(['non-option'])
 * // => Error('...')
 */
function collect<TOption>(options: Option<TOption>[]): Option<TOption[]> {
  return all(options);
}

/**
 * Creates an array from an array of Options.
 *
 * @group Collection
 *
 * @see {@link all} - for creating an array
 * @see {@link collect} - for creating an array
 *
 * @template TOption - The type of the Option.
 *
 * @param options - An array of Options to extract values from.
 * @throws {Error} - If array contains non-Option values
 *
 * @example
 * Option.values([Option.some(1), Option.some(2), Option.some(3)])
 * // => [1, 2, 3]
 * Option.values([Option.some(1), Option.none(), Option.some(2), Option.none()])
 * // => [1, 2]
 * Option.values([])  // => []
 *
 * Option.values(['non-option'])
 * // => Error('...')
 */
function values<TOption>(options: Option<TOption>[]): TOption[] {
  if (isEmptyArray(options)) {
    return [];
  }

  const someValues: TOption[] = [];

  for (const [i, option] of options.entries()) {
    if (!isOption(option)) {
      throw new ResultTypeError(
        `Option.values() received an invalid value at index [${i}]: expected a Option, got "${typeof option}"`,
        option,
      );
    }

    if (option.isSome()) {
      someValues.push(option.unwrap());
    }
  }

  return someValues;
}

// #endregion

// biome-ignore format: off
export const option = {
  // Type guards
  isNone,
  isSome,
  isOption,
  // Creation
  none,
  some,
  fromNullable,
  fromPromise,
  fromTry,
  validate,
  // Collection
  all,
  collect,
  values,
};
