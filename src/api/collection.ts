import type { Option } from '@/types';

import { isOption } from './type-guards';

import { ResultTypeError } from '@/lib/errors';
import { NONE } from '@/lib/none';
import { SomeClass } from '@/lib/some';
import { isEmptyArray } from '@/lib/utils';

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
export function all<TOption>(options: Option<TOption>[]): Option<TOption[]> {
  if (isEmptyArray(options)) {
    return new SomeClass([]);
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

  return new SomeClass(someValues);
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
export function collect<TOption>(options: Option<TOption>[]): Option<TOption[]> {
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
export function values<TOption>(options: Option<TOption>[]): TOption[] {
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
