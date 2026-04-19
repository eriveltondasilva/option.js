export class NoneUnwrapError extends Error {
  constructor(message = 'Called unwrap() on a None value') {
    super(message)
    this.name = 'NoneUnwrapError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoneUnwrapError)
    }
  }
}
