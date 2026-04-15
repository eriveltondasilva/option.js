import { Option } from '.'

// Criação
const a = Option.some(42)
const b = Option.none
// const c = Option.from(maybeNull)       // T | null | undefined → Option<T>

// Verificação
a.isSome() // true
a.isNone() // false
a.isSomeAnd((val) => val > 10) // true

// Extração segura
a.unwrap() // 42 (lança se None)
a.expect('valor obrigatório') // 42 (lança mensagem customizada)
a.unwrapOr(0) // 42
a.unwrapOrElse(() => 0) // 42

// Transformação
a.map((val) => val * 2) // Some(84)
a.mapOr(0, (val) => val * 2) // 84
a.andThen((val) => Option.some(val + 1)) // Some(43)
a.filter((val) => val > 100) // None

// Alternativas
b.or(Option.some(99)) // Some(99)
b.orElse(() => Option.some(99)) // Some(99)

// Pattern matching
a.match({
  some: (val) => `valor: ${String(val)}`,
  none: () => 'sem valor',
})

// Conversão
a.toNullable() // 42 | null
a.toUndefined() // 42 | undefined

//
