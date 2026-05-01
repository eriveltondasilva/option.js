import type { Option as _Option } from './types';

import { option } from './option';

/**
 * Type-safe optional values inspired by Rust's `Option<T>`.
 *
 * Eliminates `null` and `undefined` pitfalls by wrapping values in `Some(T)` or `None`.
 * Provides chainable transformations, safe unwrapping, and pattern matching.
 *
 * `Option` serves dual purpose: as a **namespace** for creating and working with optional values,
 * and as a **type** for annotating variables, parameters, and return types.
 *
 * @example
 * function findUser(id: number): Option<User> {
 *   const user = db.find(id)
 *   return Option.fromNullable(user)
 * }
 *
 * function getAge(option: Option<User>): number {
 *   return option.map((u) => u.age).unwrapOr(0)
 * }
 *
 * @example
 * Option.some(42)              // => Some(42)
 * Option.none()                // => None
 * Option.fromTry(() => value)  // => Some(value) | None
 * Option.fromNullable(value)   // => Some(value) | None
 *
 * @example
 * Option
 *   .some(10)
 *   .map(x => x * 2)
 *   .filter(x => x > 15)
 *   .unwrapOr(0) // => 20
 *
 * @example
 * Option
 *   .some(42)
 *   .match({
 *     some: (v) => `Got: ${v}`,
 *     none: () => 'Nothing here'
 *   })
 * // => 'Got: 42'
 *
 * Option
 *   .some(10)
 *   .inspect((v) => console.log('got: ' + v))
 * // => Some(10)
 *
 * @example
 * Option.all([some(1), some(2)])
 * // => Some([1, 2])
 * Option.values([some(1), none()])
 * // => [1]
 */
export const Option = Object.freeze(option);

export const { some, none } = option;
export type Option<T> = _Option<T>;

export type { AsyncOption, None, Some } from './types';

export default Option;
