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
