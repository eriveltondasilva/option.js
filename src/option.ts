import { NoneClass as None } from './none'
import { Some } from './some'

import type { Option } from './types'

/**
 * Creates an Option from a value.
 */
function some<T>(value: T): Option<T> {
  return new Some<T>(value)
}

/**
 * Creates an Option from a nullable value.
 * null | undefined → None, otherwise → Some(value)
 */
function fromNullable<T>(value: T | null | undefined): Option<NonNullable<T>> {
  return value == null ? None : new Some(value)
}

/**
 * Type guard — checks if option is Some<T>
 */
function isSome<T>(value: unknown): value is Some<T> {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'Some'
}

/**
 * Type guard — checks if option is None
 */
function isNone(value: unknown): value is typeof None {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'None'
}

/**
 * Type guard — checks if value is Option<unknown>
 */
function isOption<T>(value: unknown): value is Option<T> {
  return isSome(value) || isNone(value)
}

export const option = {
  none: None,
  some,
  fromNullable,
  isSome,
  isNone,
  isOption,
} as const
