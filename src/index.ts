import { option } from './option'

import type { Option as OptionType } from './types'

export { NoneClass as None } from './none'
export { Some } from './some'

export type Option<T> = OptionType<T>
export const Option = Object.freeze(option)
export default Option
