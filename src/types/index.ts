import type { TAG } from '@/brand';
import type { OptionMethods } from './methods';

/**
 * Represents an option that contains a value.
 *
 * @template TValue
 */
export interface Some<TValue> extends OptionMethods<TValue> {
  /** @internal */
  readonly _tag: typeof TAG.Some;

  toJSON(): { type: 'some'; value: TValue };
}

/**
 * Represents an option that does not contain a value.
 */
export interface None extends OptionMethods<never> {
  /** @internal */
  readonly _tag: typeof TAG.None;

  toJSON(): { type: 'none'; value: undefined };
}

/**
 * Represents an option that may or may not contain a value.
 *
 * @template TValue
 */
export type Option<TValue> = Some<TValue> | None;

/**
 * Represents an async option that may or may not contain a value.
 *
 * @template TValue
 */
export type AsyncOption<TValue> = Promise<Option<TValue>>;
