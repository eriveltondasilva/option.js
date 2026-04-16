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
  mapOr<U>(fn: (value: T) => U, defaultValue: U): U
  mapOrElse<U>(fn: (value: T) => U, defaultFn: () => U): U
  filter(predicate: (value: T) => boolean): Option<T>
  flatten<U>(this: Option<Option<U>>): Option<U>

  // Alternativas
  // and<U>(other: Option<U>): Option<U>
  andThen<U>(fn: (value: T) => Option<U>): Option<U>
  or<U>(other: Option<U>): Option<T | U>
  orElse<U>(fn: () => Option<U>): Option<T | U>

  // Inspeção
  match<U>(patterns: { some: (value: T) => U; none: () => U }): U
  inspect(fn: (value: T) => void): Option<T>

  // Conversão
  toNullable(): T | null
}

export interface Some<T> extends OptionMethods<T> {
  readonly _tag: 'Some'
  readonly value: T
}

export interface None extends OptionMethods<never> {
  readonly _tag: 'None'
}

export type Option<T> = Some<T> | None
