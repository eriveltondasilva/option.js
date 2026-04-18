import { NoneClass as None } from './none.ts'
import { Some } from './some.ts'
import type { IAsyncOption, INone, IOption, ISome, Option } from './types.ts'

// #region Type Guards

function isSome<T>(value: unknown): value is ISome<T> {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'Some'
}

function isNone(value: unknown): value is INone {
  return value != null && typeof value === 'object' && '_tag' in value && value._tag === 'None'
}

function isOption<T>(value: unknown): value is IOption<T> {
  return isSome(value) || isNone(value)
}

function isEmpty<T>(options: IOption<T>[]): boolean {
  return all(options).isNone()
}

// #endregion

// #region Creation

function some<T>(value: T): ISome<T> {
  return new Some<T>(value)
}

function none(): INone {
  return None
}

function fromTry<T>(fn: () => T): IOption<T> {
  try {
    return new Some(fn())
  } catch {
    return None
  }
}

async function fromPromise<T>(fn: () => Promise<T>): IAsyncOption<T> {
  try {
    return new Some(await fn())
  } catch {
    return None
  }
}

function fromNullable<T>(value: T | null | undefined): IOption<NonNullable<T>> {
  return value == null ? None : new Some(value)
}

function validate<T>(value: T, fn: (value: T) => boolean): IOption<T> {
  return fn(value) ? new Some(value) : None
}

// #endregion

// #region Collection

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

function collect<T>(options: IOption<T>[]): IOption<T[]> {
  return all(options)
}

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

export const option: Option = {
  // # Type Guards
  isSome,
  isNone,
  isOption,
  isEmpty,
  // # Creation
  some,
  none,
  fromTry,
  fromPromise,
  fromNullable,
  validate,
  // # Collection
  all,
  collect,
  values,
} as const
