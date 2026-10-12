import type { AnyObject } from '@swagglar/types/utils'

import { normalize } from '@/utils/normalize'
import { resolveReferences } from '@/utils/resolve-references'

export function resolveNew(specification: AnyObject) {
  return resolveReferences(normalize(specification))
}
