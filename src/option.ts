import { NoneClass as None } from './none.ts'
import { Some } from './some.ts'
import type { IAsyncOption, INone, IOption, ISome } from './types.ts'

// #region Type Guards

/**
 * Checks if option is Some<T>
 *
 * @group Type Guards
 *
 * @see {@link isOption}
 *
 * @example
 * Option.isSome(Option.some(42)) // => true
 * Option.isSome(Option.none())   // => false
 */
function isSome<T>(value: unknown): value is ISome<T> {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'Some'
}

/**
 * Checks if option is None
 *
 * @group Type Guards
 *
 * @see {@link isOption}
 *
 * @example
 * Option.isNone(Option.none())   // => true
 * Option.isNone(Option.some(42)) // => false
 */
function isNone(value: unknown): value is INone {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'None'
}

/**
 * Checks if value is Option<unknown>
 *
 * @group Type Guards
 *
 * @see {@link isSome}
 * @see {@link isNone}
 *
 * @example
 * Option.isOption(Option.some(42)) // => true
 * Option.isOption(Option.none())   // => true
 */
function isOption<T>(value: unknown): value is IOption<T> {
  return isSome(value) || isNone(value)
}

/**
 * Checks if all options are `None`.
 *
 * @group Type Guards
 *
 * @example
 * Option.isEmpty([Option.some(42), Option.some(99)]) // => false
 * Option.isEmpty([Option.some(42), Option.none()])   // => true
 * Option.isEmpty([Option.none(), Option.none()])     // => true
 * Option.isEmpty([])                                 // => true
 */
function isEmpty<T>(options: IOption<T>[]): boolean {
  return options.length === 0 || options.every((opt) => opt.isNone())
}

// #endregion

// #region Creation

/**
 * Creates an Option from a value.
 *
 * @group Creation
 *
 * @example
 * Option.some(42)      // => Some(42)
 * Option.some('hello') // => Some('hello')
 */
function some<T>(value: T): ISome<T> {
  return new Some<T>(value)
}

/**
 * Creates an empty Option.
 *
 * @group Creation
 *
 * @example
 * Option.none() // => None
 */
function none(): INone {
  return None
}

/**
 * Creates an Option from a function.
 *
 * @group Creation
 *
 * @example
 * Option.fromTry(() => 42)                       // => Some(42)
 * Option.fromTry(() => throw new Error('error')) // => None
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
 * Option.fromPromise(async () => 42)                       // => Some(42)
 * Option.fromPromise(async () => throw new Error('error')) // => None
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
 * Option.fromNullable(42)   // => Some(42)
 * Option.fromNullable(null) // => None
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
 * Option.validate(42, (val) => val > 10) // => Some(42)
 * Option.validate(5, (val) => val > 10)  // => None
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
 * @see {@link values}
 *
 * @example
 * Option.all([some(1), some(2), some(3)]) // => Some([1, 2, 3])
 * Option.all([])                          // => Some([])
 *
 * // If any option is None, the result is None
 * Option.all([some(1), some(2), None])    // => None
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
 * @see {@link all}
 * @see {@link values}
 *
 * @example
 * Option.collect([some(1), some(2), some(3)]) // => [1, 2, 3]
 * Option.collect([some(1), some(2), None])    // => [1, 2]
 * Option.collect([])                          // => []
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
 * @see {@link all}
 *
 * @example
 * Option.values([some(1), some(2), some(3)]) // => [1, 2, 3]
 * Option.values([some(1), some(2), None])    // => [1, 2]
 * Option.values([])                          // => []
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

export {
  // # Collection
  all,
  collect,
  fromNullable,
  fromPromise,
  fromTry,
  isEmpty,
  isNone,
  isOption,
  // # Type Guards
  isSome,
  none,
  // # Creation
  some,
  validate,
  values,
}
