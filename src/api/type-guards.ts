import type { None, Option, Some } from '@/types';

import { TAG as TAG_NONE } from '@/lib/none';
import { TAG as TAG_SOME } from '@/lib/some';
import { isRecord } from '@/lib/utils';

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
export function isSome(value: unknown): value is Some<unknown> {
  return isRecord(value) && TAG_SOME in value;
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
export function isNone(value: unknown): value is None {
  return isRecord(value) && TAG_NONE in value;
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
export function isOption(value: unknown): value is Option<unknown> {
  return isRecord(value) && (TAG_SOME in value || TAG_NONE in value);
}
