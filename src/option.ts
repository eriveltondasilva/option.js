import { NoneClass as None } from './none'
import { Some } from './some'

import type {
  Option as IOption,
  Some as ISome,
  None as INone,
  AsyncOption as IAsyncOption,
} from './types'

// #region Type Guards

/**
 * Checks if option is Some<T>
 *
 * @group Type Guards
 *
 * @see isOption
 *
 * @example
 * Option.isSome(Option.some(42))
 * // => true
 *
 * Option.isSome(Option.none)
 * // => false
 */
function isSome<T>(value: unknown): value is ISome<T> {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'Some'
}

/**
 * Checks if option is None
 *
 * @group Type Guards
 *
 * @see isOption
 *
 * @example
 * Option.isNone(Option.none)
 * // => true
 *
 * Option.isNone(Option.some(42))
 * // => false
 */
function isNone(value: unknown): value is INone {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'None'
}

/**
 * Checks if value is Option<unknown>
 *
 * @group Type Guards
 *
 * @see isSome
 * @see isNone
 *
 * @example
 * Option.isOption(Option.some(42))
 * // => true
 *
 * Option.isOption(Option.none)
 * // => true
 */
function isOption<T>(value: unknown): value is IOption<T> {
  return isSome(value) || isNone(value)
}

function isEmpty<T>(options: IOption<T>[]): boolean {
  return all(options).isNone()
}

// #endregion

// #region Creation

/**
 * Creates an Option from a value.
 *
 * @group Creation
 *
 * @example
 * Option.some(42)
 * // => Some(42)
 *
 * Option.some('hello')
 * // => Some('hello')
 */
function some<T>(value: T): IOption<T> {
  return new Some<T>(value)
}

/**
 * Creates an Option from a function.
 *
 * @group Creation
 *
 * @example
 * Option.fromTry(() => 42)
 * // => Some(42)
 *
 * Option.fromTry(() => throw new Error('error'))
 * // => None
 */
function fromTry<T>(fn: () => T): IOption<T> {
  try {
    return new Some(fn())
  } catch {
    return None
  }
}

/**
 * Creates an AsyncOption from a function.
 *
 * @group Creation
 *
 * @example
 * Option.fromPromise(async () => 42)
 * // => Some(42)
 *
 * Option.fromPromise(async () => throw new Error('error'))
 * // => None
 */
async function fromPromise<T>(fn: () => Promise<T>): IAsyncOption<T> {
  try {
    return new Some(await fn())
  } catch {
    return None
  }
}

/**
 * Creates an Option from a nullable value.
 *
 * @group Creation
 *
 * @example
 * Option.fromNullable(42)
 * // => Some(42)
 *
 * Option.fromNullable(null) || Option.fromNullable(undefined)
 * // => None
 */
function fromNullable<T>(value: T | null | undefined): IOption<NonNullable<T>> {
  return value == null ? None : new Some(value)
}

/**
 * Creates an Option from a value and a predicate.
 *
 * @group Creation
 *
 * @example
 * Option.validate(42, (val) => val > 10)
 * // => Some(42)
 *
 * Option.validate(5, (val) => val > 10)
 * // => None
 */
function validate<T>(value: T, fn: (value: T) => boolean): IOption<T> {
  return fn(value) ? new Some(value) : None
}

// #endregion

// #region Collection

/**
 * Creates an Option from an array of Options.
 *
 * @group Collection
 *
 * @see values
 *
 * @example
 * Option.all([some(1), some(2), some(3)])
 * // => Some([1, 2, 3])
 *
 * Option.all([some(1), some(2), None])
 * // => None
 *
 * Option.all([])
 * // => Some([])
 *
 * Option.all(['non-option'])
 * // => Error('all() called with non-Option value')
 */
function all<T>(options: IOption<T>[]): IOption<T[]> {
  if (!Array.isArray(options) || options.length === 0) return new Some([])

  const someValues: T[] = []

  for (const option of options) {
    if (!isOption(option)) throw new Error('all() called with non-Option value')
    if (option.isNone()) return None
    someValues.push(option.unwrap())
  }

  return new Some(someValues)
}

/**
 * Creates an array from an array of Options.
 *
 * @remarks
 * Alias for `all`
 *
 * @group Collection
 *
 * @see all
 * @see values
 *
 * @example
 * Option.collect([some(1), some(2), some(3)])
 * // => [1, 2, 3]
 *
 * Option.collect([some(1), some(2), None])
 * // => [1, 2]
 *
 * Option.collect([])
 * // => []
 *
 * Option.collect(['non-option'])
 * // => Error('collect() called with non-Option value')
 */
function collect<T>(options: IOption<T>[]): IOption<T[]> {
  return all(options)
}

/**
 * Creates an array from an array of Options.
 *
 * @group Collection
 *
 * @see all
 *
 * @example
 * Option.values([some(1), some(2), some(3)])
 * // => [1, 2, 3]
 *
 * Option.values([some(1), some(2), None])
 * // => [1, 2]
 *
 * Option.values([])
 * // => []
 *
 * Option.values(['non-option'])
 * // => Error('values() called with non-Option value')
 */
function values<T>(options: IOption<T>[]): T[] {
  if (!Array.isArray(options) || options.length === 0) return []

  const someValues: T[] = []

  for (const option of options) {
    if (!isOption(option)) throw new Error('values() called with non-Option value')
    if (option.isSome()) someValues.push(option.unwrap())
  }

  return someValues
}

// #endregion

export const option = {
  // # Type Guards
  isSome,
  isNone,
  isOption,
  isEmpty,
  // # Creation
  none: None,
  some,
  fromTry,
  fromPromise,
  fromNullable,
  validate,
  // # Collection
  all,
  collect,
  values,
} as const
