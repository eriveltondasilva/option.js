import * as option from './option.ts'
import type { IAsyncOption, IOption } from './types.ts'

export type Option<T> = IOption<T>
export type AsyncOption<T> = IAsyncOption<T>

export const { some, none } = option

/**
 * Type-safe optional values inspired by Rust's `Option<T>`.
 *
 * Eliminates `null` and `undefined` pitfalls by wrapping values in `Some(T)` or `None`.
 * Provides chainable transformations, safe unwrapping, and pattern matching.
 *
 * @example
 * // # IMPORT
 * import { Option } from '@eriveltondasilva/option.js'
 * import Option from '@eriveltondasilva/option.js'
 *
 * // # CREATION
 * Option.some(42)              // => Some(42)
 * Option.none()                // => None
 * Option.fromTry(() => value)  // => Some(value) | None
 * Option.fromNullable(value)   // => Some(value) | None
 *
 * // # CHAINING
 * Option
 *   .some(10)
 *   .map(x => x * 2)
 *   .filter(x => x > 15)
 *   .unwrapOr(0) // => 20
 *
 * // # INSPECTION
 * Option
 *   .some(42)
 *   .match({
 *     some: (v) => `Got: ${v}`,
 *     none: () => 'Nothing here'
 *   }) // => Got: 42
 * Option
 *   .some(10)
 *   .inspect((v) => console.log('got: ' + v))
 * // => Some(10)
 *
 * // # COLLECTIONS
 * Option.all([some(1), some(2)])  // => Some([1, 2])
 * Option.values([some(1), none()]) // => [1]
 */
export const Option = Object.freeze({ ...option })
export default Option
