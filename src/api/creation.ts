import type { AsyncOption, Option, Some } from '@/types';

import { NONE } from '@/lib/none';
import { SomeClass } from '@/lib/some';

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
export function some<TValue>(value: TValue): Some<TValue> {
  return new SomeClass(value);
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
export function none<T = never>(): Option<T> {
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
export function fromTry<TValue>(fn: () => TValue): Option<TValue> {
  try {
    return new SomeClass(fn());
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
export async function fromPromise<TValue>(fn: () => Promise<TValue>): AsyncOption<TValue> {
  try {
    return new SomeClass(await fn());
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
export function fromNullable<TValue>(
  value: TValue | null | undefined,
): Option<NonNullable<TValue>> {
  return value == null ? NONE : new SomeClass(value);
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
export function validate<TValue>(value: TValue, fn: (value: TValue) => boolean): Option<TValue> {
  return fn(value) ? new SomeClass(value) : NONE;
}
