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
 * @param value The value to check.
 * @returns {boolean} True if value is Some, false otherwise.
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
 * @param value The value to check.
 * @returns {boolean} True if value is None, false otherwise.
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
 * @param value The value to check.
 * @returns {boolean} True if value is an Option (Some<T> or None), false otherwise.
 *
 * @example
 * Option.isOption(Option.some(42)) // => true
 * Option.isOption(Option.none())   // => true
 */
function isOption<T>(value: unknown): value is IOption<T> {
  return (
    value != null &&
    typeof value === 'object' &&
    '_tag' in value &&
    (value._tag === 'Some' || value._tag === 'None')
  )
}

// #endregion

// #region Creation

/**
 * Creates an Option from a value.
 *
 * @group Creation
 *
 * @param value The value to create an Option from.
 * @return An Option containing the value (Some<T>).
 *
 * @example
 * Option.some(42)                 // => Some(42)
 * Option.some('hello')            // => Some('hello')
 * Option.some({ value: 'hello' }) // => Some({ value: 'hello' })
 */
function some<T>(value: T): ISome<T> {
  return new Some<T>(value)
}

/**
 * Creates an empty Option.
 *
 * @group Creation
 *
 * @returns An Option containing nothing (None).
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
 * @see {@link fromPromise}
 *
 * @param fn The function to execute and create an Option from.
 * @return An Option containing the result of the function, or None if the function throws an error.
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
 * @see {@link fromTry}
 *
 * @param fn The function to execute and create an Option from.
 * @return An AsyncOption containing the result of the function, or None if the function throws an error.
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
 * @see {@link fromTry}
 *
 * @param value The nullable value to create an Option from.
 * @return An Option containing the value, or None if the value is null or undefined.
 *
 * @example
 * Option.fromNullable(42)        // => Some(42)
 * Option.fromNullable(null)      // => None
 * Option.fromNullable(undefined) // => None
 */
function fromNullable<T>(value: T | null | undefined): IOption<NonNullable<T>> {
  return value == null ? None : new Some(value)
}

/**
 * Creates an Option from a value and a predicate.
 *
 * @group Creation
 *
 * @see {@link some}
 *
 * @param value The value to validate.
 * @param fn The predicate to validate the value.
 * @return An Option containing the value if the predicate returns true, or None if the predicate returns false.
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
 * @see {@link collect}
 * @see {@link values}
 *
 * @param options An array of Options to extract values from.
 * @returns {IOption<T[]>} An Option containing an array of values if all options are Some, or None if any option is None.
 * @throws {Error} If array contains non-Option values
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
function all<T>(options: IOption<T>[], name = 'all'): IOption<T[]> {
  if (!Array.isArray(options)) return new Some([])

  const someValues: T[] = []

  for (const [i, option] of options.entries()) {
    if (!isOption(option))
      throw new Error(
        `Option.${name}() called with non-Option value at index ${i}: ${typeof option}`,
      )
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
 * @param options An array of Options to extract values from.
 * @returns {IOption<T[]>} An Option containing an array of values if all options are Some, or None if any option is None.
 * @throws {Error} If array contains non-Option values
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
function collect<T>(options: IOption<T>[]): IOption<T[]> {
  return all(options, 'collect')
}

/**
 * Creates an array from an array of Options.
 *
 * @group Collection
 *
 * @see {@link all}
 *
 * @param options An array of Options to extract values from.
 * @return An array of values from the Some options. None options are ignored.
 * @throws {Error} If array contains non-Option values
 *
 * @example
 * Option.values([Option.some(1), Option.some(2), Option.some(3)])
 * // => [1, 2, 3]
 * Option.values([Option.some(1), Option.none(), Option.some(2), Option.none(), Option.some(3)])
 * // => [1, 2, 3]
 * Option.values([])  // => []
 *
 * Option.values(['non-option'])
 * // => Error('...')
 */
function values<T>(options: IOption<T>[]): T[] {
  if (!Array.isArray(options)) return []

  const someValues: T[] = []

  for (const [i, option] of options.entries()) {
    if (!isOption(option))
      throw new Error(
        `Option.values() called with non-Option value at index ${i}: ${typeof option}`,
      )
    if (option.isSome()) someValues.push(option.unwrap())
  }

  return someValues
}

// #endregion

export {
  all,
  collect,
  fromNullable,
  fromPromise,
  fromTry,
  isNone,
  isOption,
  isSome,
  none,
  some,
  validate,
  values,
}
