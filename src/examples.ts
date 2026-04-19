/**
 * Uso para testar as funcionalidades da biblioteca.
 * Não é um teste formal, apenas um exemplo de uso.
 */

import { Option } from './index.js'

// biome-ignore lint/suspicious/noConsole: arquivo de teste de implementação
const log = (...message: unknown[]) => console.log(message)

const a = Option.some(42)
const b = Option.none()

// Verificação
a.isSome() // => true
a.isNone() // => false
a.isSomeAnd((val) => val > 10)
// => true

// Extração segura
a.unwrap() // => 42 (lança erro se None)
a.expect('valor obrigatório') // => 42 (lança erro com mensagem customizada)
a.unwrapOr(0) // => 42
a.unwrapOrElse(() => 0) // => 42

// Transformação
a.map((val) => val * 2) // => Some(84)
a.mapOr((val) => val * 2, 0) // => 84
a.andThen((val) => Option.some(val + 1)) // => Some(43)
a.filter((val) => val > 100) // => None

// Alternativas
b.or(Option.some(99)) // => Some(99)
b.orElse(() => Option.some(99)) // => Some(99)

// Inspeção
a.match({ some: (val) => `valor: ${String(val)}`, none: () => 'sem valor' })
a.inspect((_val) => {})

log('value:', Option.values([])) // => []
log('value:', Option.values([a, a])) // => [42, 42]
log('all:', Option.all([]).unwrap()) // => Some([])
log('all with options:', Option.all([a, a]).unwrap())
