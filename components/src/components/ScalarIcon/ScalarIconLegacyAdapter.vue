<script lang="ts">
/**
 * Scalar Icon Legacy Adapter
 *
 * This component is used to help components that accept a ScalarIcon name
 * as a prop to accept a component instead to be compatible with `@swagglar/icons`
 * while staying backwards compatible with the legacy ScalarIcon component
 */
export default {}
</script>
<script setup lang="ts">
import type { ScalarIconComponent, ScalarIconProps } from '@swagglar/icons/types'
import { useBindCx } from '@swagglar/use-hooks/useBindCx'

import ScalarIcon from './ScalarIcon.vue'
import type { ScalarIconProps as LegacyScalarIconProps } from './types'
import type { Icon } from './utils'
import { variants } from './variants'

/**
 * Icon wrapper for all icons and logos
 */

defineProps<
  {
    icon: Icon | ScalarIconComponent
  } & ScalarIconProps &
    Omit<LegacyScalarIconProps, 'icon'>
>()

defineOptions({ inheritAttrs: false })
const { cx } = useBindCx()
</script>
<template>
  <ScalarIcon
    v-if="typeof icon === 'string'"
    v-bind="{ ...$props, ...$attrs }"
    :icon="icon" />
  <component
    :is="icon"
    v-else
    :label="label"
    :weight="weight"
    v-bind="cx(variants({ size }))" />
</template>
