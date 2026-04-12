export interface OptionMethods<T> {
  // Verificação
  isSome(): this is Some<T>
  isNone(): this is None
  isSomeAnd(predicate: (value: T) => boolean): boolean
  isNoneOr(predicate: (value: T) => boolean): boolean

  // Extração
  unwrap(): T
  expect(message: string): T
  unwrapOr<U>(defaultValue: U): T | U
  unwrapOrElse<U>(fn: () => U): T | U

  // Transformação
  map<U>(fn: (value: T) => U): Option<U>
  mapOr<U>(defaultValue: U, fn: (value: T) => U): U
  mapOrElse<U>(defaultFn: () => U, fn: (value: T) => U): U
  flatMap<U>(fn: (value: T) => Option<U>): Option<U>
  filter(predicate: (value: T) => boolean): Option<T>

  // Alternativas
  or<U>(other: Option<U>): Option<T | U>
  orElse<U>(fn: () => Option<U>): Option<T | U>

  // Pattern matching
  match<U>(patterns: { some: (value: T) => U; none: () => U }): U

  // Conversão
  toNullable(): T | null
  toUndefined(): T | undefined
}

export interface Some<T> extends OptionMethods<T> {
  readonly _tag: 'Some'
  readonly value: T
}

export interface None extends OptionMethods<never> {
  readonly _tag: 'None'
}

export type Option<T> = Some<T> | None
