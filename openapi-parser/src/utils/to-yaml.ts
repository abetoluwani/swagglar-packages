import type { AnyObject } from '@swagglar/types/utils'
import { stringify } from 'yaml'

export const toYaml = (value: AnyObject) => stringify(value)
