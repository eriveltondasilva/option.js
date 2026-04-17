export interface OptionMethods<T> {
  // Type Guards
  isSome(): this is Some<T>
  isNone(): this is None
  isSomeAnd(predicate: (value: T) => boolean): boolean
  isNoneOr(predicate: (value: T) => boolean): boolean

  // Extraction
  unwrap(): T
  expect(message: string): T
  unwrapOr<U>(defaultValue: U): T | U
  unwrapOrElse<U>(fn: () => U): T | U

  // Transformation
  map<U>(fn: (value: T) => U): Option<U>
  mapOr<U>(fn: (value: T) => U, defaultValue: U): U
  mapOrElse<U>(fn: (value: T) => U, defaultFn: () => U): U
  filter(predicate: (value: T) => boolean): Option<T>
  flatten<U>(this: Option<Option<U>>): Option<U>

  // Alternation
  and<U>(other: Option<U>): Option<U>
  andThen<U>(fn: (value: T) => Option<U>): Option<U>
  or<U>(other: Option<U>): Option<T | U>
  orElse<U>(fn: () => Option<U>): Option<T | U>

  // Combination
  zip<U>(other: Option<U>): Option<[T, U]>
  zipWith<U, R>(other: Option<U>, fn: (a: T, b: U) => R): Option<R>

  // Inspection
  match<U>(handlers: { some: (value: T) => U; none: () => U }): U
  inspect(fn: (value: T) => void): Option<T>
  tap(fn: (value: T) => void): Option<T>

  // Conversion
  toNullable(): T | null
  toUndefined(): T | undefined

  // TODO: implement these methods
  // toString(): string
  // toValue(): T
  // toJSON(): T
}

export interface Some<T> extends OptionMethods<T> {
  readonly _tag: 'Some'
}

export interface None extends OptionMethods<never> {
  readonly _tag: 'None'
}

export type Option<T> = Some<T> | None

export type AsyncOption<T> = Promise<Option<T>>
