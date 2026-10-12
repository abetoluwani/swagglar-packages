import type { AnyObject } from '@swagglar/types/utils'

export const toJson = (value: AnyObject) => JSON.stringify(value, null, 2)
