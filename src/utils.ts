/** @internal */
export class NoneUnwrapError extends Error {
  constructor(message = 'Called unwrap() on a None value') {
    super(message);

    this.name = 'NoneUnwrapError';

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** @internal */
export class ResultTypeError extends TypeError {
  constructor(message: string, cause?: unknown) {
    super(`${message}. Make sure element is created with Option.some() or Option.none().`, {
      cause,
    });

    this.name = 'ResultTypeError';

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** @internal */
export function isEmptyArray(value: unknown): boolean {
  if (!Array.isArray(value)) {
    throw new TypeError(
      `Expected an array, but received ${typeof value}. Make sure you are passing an array to the collection function.`,
      { cause: value },
    );
  }

  return value.length === 0;
}

/** @internal */
export function formatForDisplay(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (value instanceof Error) {
    const base = `${value.name}: ${value.message}`;
    return value.cause !== undefined ? `${base} (cause: ${formatForDisplay(value.cause)})` : base;
  }

  if (typeof value === 'string') {
    const truncated = value.length > 100 ? `${value.slice(0, 100)}...` : value;
    return `"${truncated}"`;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'bigint') return `${value}n`;

  if (typeof value === 'symbol') return value.toString();

  if (Array.isArray(value)) {
    return value.length <= 5
      ? `[${value.map(formatForDisplay).join(', ')}]`
      : `Array(${value.length})`;
  }

  try {
    const json = JSON.stringify(value);
    return json.length > 100 ? `${json.slice(0, 100)}...` : json;
  } catch {
    return value?.constructor?.name ?? 'Object';
  }
}
