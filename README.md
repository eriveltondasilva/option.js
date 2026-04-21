# Option.js

[![npm version](https://img.shields.io/npm/v/@eriveltonsilva/option.js)](https://www.npmjs.com/package/@eriveltonsilva/option.js)
[![npm size](https://img.shields.io/npm/unpacked-size/@eriveltonsilva/option.js)](https://www.npmjs.com/package/@eriveltonsilva/option.js)
[![CI](https://github.com/eriveltondasilva/option.js/workflows/CI/badge.svg)](https://github.com/eriveltondasilva/option.js/actions)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?logo=biome)](https://biomejs.dev)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-blue)](https://www.npmjs.com/package/@eriveltonsilva/option.js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight, type-safe library inspired by Rust's `Option` enum for handling optional values in JavaScript and TypeScript without `null` or `undefined` pitfalls.

## Features

- **Type-safe by design**: Eliminates unsafe `null`/`undefined` access by enforcing explicit handling.
- **Composable API**: Chainable methods like `map`, `andThen`, `filter`, `unwrapOr`, and more.
- **Singleton `None`**: Single shared instance for better memory usage.
- **TypeScript-first**: Fully typed with excellent inference.
- **Tiny footprint**: Zero dependencies and minimal bundle size.

## Installation

```bash
npm install @eriveltonsilva/option.js
```

## Usage

### Basic Example

```typescript
import { Option } from '@eriveltonsilva/option.js'
// import Option from '@eriveltonsilva/option.js'

function getUsername(id: number): Option<string> {
  const users = { 1: 'Erivelton' }
  return Option.fromNullable(users[id])
}

const user = getUsername(1)
  .map((name) => name.toUpperCase())
  .unwrapOr('ANONYMOUS')

console.log(user) // => "ERIVELTON"
```

### Chaining with `and()` and `andThen()`

```typescript
const some = Option.some(10)
const other = Option.some(20)

// Returns 'other' only if 'some' is Some
const result = some.and(other)

// Chain operations that return Options
const result = some.andThen((val) => Option.some(val * 2))
```

### Pattern Matching

```typescript
const result = Option.fromNullable(someData)

const message = result.match({
  some: (val) => `Found: ${val}`,
  none: () => 'Nothing here',
})
```

## API Overview

### Factories

- `Option.some(val)`: Wraps a value.
- `Option.none()`: The singleton instance for absent values.
- `Option.fromNullable(val)`: Safely converts `null` | `undefined` to `None`.

### Guards

- `Option.isOption(val)`: Checks if a value is an instance of `Some` or `None`.
- `Option.isSome(val)`: Type guard for `Some`.
- `Option.isNone(val)`: Type guard for `None`.

### Key Instance Methods

| Method             | Description                                         |
| :----------------- | :-------------------------------------------------- |
| `.map(fn)`         | Transforms the value inside a `Some`.               |
| `.and(other)`      | Returns `other` if instance is `Some`, else `None`. |
| `.andThen(fn)`     | Returns the Option resulting from `fn` if `Some`.   |
| `.unwrapOr(alt)`   | Returns value or the provided fallback.             |
| `.match(handlers)` | Executes a branch based on the state.               |
| `.inspect(fn)`     | Runs a side-effect without changing the Option.     |

## License

MIT © [Erivelton Silva](https://github.com/eriveltondasilva)

## Related Projects

If you find this library useful, check out my other functional utilities:

**[@eriveltonsilva/result.js](https://www.npmjs.com/package/@eriveltonsilva/result.js)** — A type-safe way to handle errors and successes without `try/catch` overhead, inspired by Rust's `Result` type.

```typescript
import { Option } from '@eriveltonsilva/option.js'
import { Result } from '@eriveltonsilva/result.js'

const user = Option.fromNullable(null) // => None

// Converting an Option to a Result (conceptually)
const userResult = user.match({
  some: (val) => Result.ok(val),
  none: () => Result.err('User not found'),
})
// => Err("User not found")
```
