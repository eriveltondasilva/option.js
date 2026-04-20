/** biome-ignore-all lint/suspicious/noConsole: arquivo de testes */

/**
 * Uso para testar as funcionalidades da biblioteca.
 * Não é um teste formal, apenas um exemplo de uso.
 */
//
import { none, Option, some } from './index.js'

// import { none, Option, some } from '../dist/index.js'

const log = (...message: unknown[]) => console.log(message)

const a = Option.some(42).unwrap()
const b = Option.none().unwrapOr(0)
const c = some(123).unwrap()
const d = none().unwrapOr(0)

log('a:', a)
log('b:', b)
log('c:', c)
log('d:', d)

log('value:', Option.values([])) // => []
log('value:', Option.values([some(42), some(42)])) // => [42, 42]
log('all:', Option.all([]).unwrap()) // => Some([])
log('all with options:', Option.all([some(42), some(42)]).unwrap())
