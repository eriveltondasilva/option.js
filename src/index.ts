import { option } from './option.ts'
import type { IOption } from './types.ts'

export { NoneClass as None } from './none.ts'
export { Some } from './some.ts'

export type Option<T> = IOption<T>
export const Option = Object.freeze(option)
export default Option
