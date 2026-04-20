# @eriveltondasilva/option.js

A lightweight, type-safe library inspired by Rust's `Option` enum for handling optional values in JavaScript and TypeScript without `null` or `undefined` pitfalls.

## 🚀 Features

- **Type Safety**: Prevents "cannot read property of null" errors by forcing explicit handling of absent values.
- **Functional API**: Chainable methods like `map`, `andThen`, `filter`, `and`, and more.
- **Singleton None**: Memory-efficient `None` implementation using a singleton pattern.
- **Modern Stack**: Built with TypeScript, optimized with `tsup`, and tested with `vitest`.
- **Zero Dependencies**: Extremely lightweight.

## 📦 Installation

```bash
# Using npm
npm install @eriveltondasilva/option.js

## 🛠 Usage

### Basic Example

```typescript
import { Option } from '@eriveltondasilva/option.js'
// import Option from '@eriveltondasilva/option.js'

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
const maybeValue = Option.fromNullable(someData)

const message = maybeValue.match({
  some: (val) => `Found: ${val}`,
  none: () => 'Nothing here',
})
```

## 📖 API Overview

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

## 📄 License

MIT © [Erivelton Silva](https://github.com/eriveltondasilva)

## 🔗 Related Projects

If you find this library useful, check out my other functional utilities:

- **[@eriveltondasilva/result.js](https://github.com/eriveltondasilva/result.js)** - A type-safe way to handle errors and successes without `try/catch` overhead, inspired by Rust's `Result` type.

```typescript
import { Option } from '@eriveltondasilva/option.js'
import { Result } from '@eriveltondasilva/result.js'

const user = Option.fromNullable(null) // => None

// Converting an Option to a Result (conceptually)
const userResult = user.match({
  some: (val) => Result.ok(val),
  none: () => Result.err('User not found'),
})
// => Err("User not found")
```
