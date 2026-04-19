import * as option from './option.ts'
import type { IAsyncOption, IOption } from './types.ts'

export { NoneClass as None } from './none.ts'
export { Some } from './some.ts'

export type Option<T> = IOption<T>
export type AsyncOption<T> = IAsyncOption<T>

export const Option = Object.freeze({ ...option })
export default Option
