import { None } from './none'
import { Some } from './some'

import type { Option as IOption } from './types'

/**
 * Creates an Option from a value.
 */
function some<T>(value: T): IOption<T> {
  return new Some<T>(value)
}

/**
 * Creates an Option from a nullable value.
 * null | undefined → None, otherwise → Some(value)
 */
function from<T>(value: T | null | undefined): IOption<NonNullable<T>> {
  return value == null ? None : new Some(value as NonNullable<T>)
}

/**
 * Type guard — checks if option is Some<T>
 */
function isSome<T>(option: IOption<T>): option is Some<T> {
  return option._tag === 'Some'
}

/**
 * Type guard — checks if option is None
 */
function isNone<T>(option: IOption<T>): option is typeof None {
  return option._tag === 'None'
}

export const Option = {
  none:None,
  some,
  from,
  isSome,
  isNone,
} as const
