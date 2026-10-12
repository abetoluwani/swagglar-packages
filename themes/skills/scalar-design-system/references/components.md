# Scalar components — full reference

Source of truth — the **`@swagglar/components`** package (icons in **`@swagglar/icons`**). Read these from `node_modules/`:

- `@swagglar/components` `package.json` `exports` — the subpath → component map (below).
- `@swagglar/components` (package root) — the full list of named exports.
- The bundled TypeScript declarations (`*.d.ts`) shipped with each component — props, variants, and JSDoc.
- The `@swagglar/components` Storybook — live variants and controls.
- `@swagglar/icons` (package root) — the `ScalarIcon*` set.

## Conventions

- **Vue 3** library, **scoped to `.scalar-app`**. Rendered markup must sit inside a `.scalar-app` root.
- **Import from the subpath**, never the barrel: `import { ScalarButton } from '@swagglar/components/button'`.
- **Styling** uses the Tailwind classes from [`tokens.md`](./tokens.md) via `cva` variants. Each component allows Tailwind class overrides through `useBindCx` (pass `class="…"`), so prefer overriding classes over writing CSS.
- **Icons** come from `@swagglar/icons` (1,500+ Phosphor icons), not the (deprecated) `ScalarIcon` component. Use `import { ScalarIconMagnifyingGlass } from '@swagglar/icons'`, size with `size-*`, color with `text-*`.

## Subpath → component map (34 subpaths)

Several subpaths export sub-components alongside the headline component; confirm exact named exports from the package's bundled type declarations (`*.d.ts`).

| Subpath | Primary component(s) |
|---|---|
| `@swagglar/components/button` | `ScalarButton` |
| `@swagglar/components/icon-button` | `ScalarIconButton` |
| `@swagglar/components/card` | `ScalarCard` (+ `ScalarCardHeader`, `ScalarCardSection`, `ScalarCardFooter`) |
| `@swagglar/components/checkbox-input` | `ScalarCheckbox*` (checkbox, group, radio group) |
| `@swagglar/components/code-block` | `ScalarCodeBlock` (+ copy) |
| `@swagglar/components/color-mode-toggle` | `ScalarColorModeToggle` |
| `@swagglar/components/combobox` | `ScalarCombobox`, `ScalarComboboxMultiselect` |
| `@swagglar/components/copy` | `ScalarCopy` |
| `@swagglar/components/dropdown` | `ScalarDropdown` (+ menu/item/divider parts) |
| `@swagglar/components/error-boundary` | `ScalarErrorBoundary` |
| `@swagglar/components/file-upload` | `ScalarFileUpload` |
| `@swagglar/components/floating` | `ScalarFloating`, `ScalarFloatingBackdrop` |
| `@swagglar/components/form` | `ScalarForm` (+ field/input/section/error parts) |
| `@swagglar/components/header` | `ScalarHeader`, `ScalarHeaderColumn`, `ScalarHeaderButton` |
| `@swagglar/components/hotkey` | `ScalarHotkey`, `ScalarHotkeyTooltip` |
| `@swagglar/components/icon` | `ScalarIcon` (legacy — prefer `@swagglar/icons`) |
| `@swagglar/components/listbox` | `ScalarListbox` |
| `@swagglar/components/loading` | `ScalarLoading` (+ `useLoadingState`) |
| `@swagglar/components/markdown` | `ScalarMarkdown`, `ScalarMarkdownSummary` |
| `@swagglar/components/menu` | `ScalarMenu` (+ workspace/team/product parts) |
| `@swagglar/components/modal` | `ScalarModal` (+ `useModal`) |
| `@swagglar/components/popover` | `ScalarPopover` |
| `@swagglar/components/save-prompt` | `ScalarSavePrompt` |
| `@swagglar/components/search-input` | `ScalarSearchInput` |
| `@swagglar/components/search-results` | `ScalarSearchResults` (+ list/item) |
| `@swagglar/components/sidebar` | `ScalarSidebar` (+ section/group/item/search parts) |
| `@swagglar/components/teleport` | `ScalarTeleport` (+ `useTeleport`) |
| `@swagglar/components/text-area` | `ScalarTextArea` |
| `@swagglar/components/text-input` | `ScalarTextInput`, `ScalarTextInputCopy` |
| `@swagglar/components/theme-swatches` | `ScalarThemeSwatches` |
| `@swagglar/components/toggle` | `ScalarToggle`, `ScalarToggleGroup`, `ScalarToggleInput` |
| `@swagglar/components/tooltip` | `ScalarTooltip` (+ `useTooltip`) |
| `@swagglar/components/virtual-text` | `ScalarVirtualText` |
| `@swagglar/components/wrapping-text` | `ScalarWrappingText` |

(Plus `@swagglar/components/helpers` for utilities, and CSS exports `style.css`, `tailwind.config.css`, `vue-styles.css`.)

## Grouped overview

- **Buttons & selection:** `ScalarButton`, `ScalarIconButton`, `ScalarToggle` / `ScalarToggleGroup` / `ScalarToggleInput`.
- **Form inputs:** `ScalarTextInput` / `ScalarTextInputCopy`, `ScalarTextArea`, `ScalarCheckbox*`, `ScalarSearchInput`, `ScalarFileUpload`, `ScalarForm`.
- **Selection / floating:** `ScalarCombobox` / `ScalarComboboxMultiselect`, `ScalarListbox`, `ScalarDropdown`, `ScalarPopover`, `ScalarTooltip` (all built on `ScalarFloating` + Floating UI).
- **Overlays:** `ScalarModal`, `ScalarSavePrompt`, `ScalarFloatingBackdrop`.
- **Layout & navigation:** `ScalarHeader` / `ScalarHeaderColumn` / `ScalarHeaderButton`, `ScalarSidebar`, `ScalarMenu`. Compose `ScalarHeaderColumn` children inside `ScalarHeader`; it has no layout slots.
- **Content:** `ScalarCard`, `ScalarCodeBlock`, `ScalarMarkdown`, `ScalarSearchResults`, `ScalarVirtualText`, `ScalarWrappingText`.
- **Utilities:** `ScalarLoading`, `ScalarHotkey`, `ScalarCopy`, `ScalarColorModeToggle`, `ScalarThemeSwatches`, `ScalarTeleport`, `ScalarErrorBoundary`.

## Headline components

### `ScalarButton` (`/button`)

Props:

- `variant`: `solid` (default) | `outlined` | `ghost` | `gradient` | `danger`
- `size`: `xs` | `sm` | `md` (default)
- `is`: render as another element/component (default `'button'`; e.g. `is="a"` for a link)
- `disabled`: visually disabled (does not block interaction; sets `aria-disabled`)
- `icon`: a `ScalarIconComponent` from `@swagglar/icons`
- `loader`: a `LoadingState` from `useLoadingState()` — shows a spinner, hides text/icon

Variant → classes:

| Variant | Classes |
|---|---|
| `solid` | `bg-b-btn text-c-btn hover:bg-h-btn active:bg-b-btn` |
| `outlined` | `shadow-border bg-b-1 text-c-1 hover:bg-b-2` |
| `ghost` | `bg-transparent text-c-2 hover:text-c-1 active:text-c-1` |
| `gradient` | `shadow-border bg-b-1.5 bg-linear-to-b from-b-1 to-b-2` (reversed in dark) |
| `danger` | `bg-c-danger text-white hover:brightness-90` |

```vue
<script setup lang="ts">
import { ScalarButton } from '@swagglar/components/button'
import { ScalarIconAcorn } from '@swagglar/icons'
</script>
<template>
  <ScalarButton variant="solid" size="md" :icon="ScalarIconAcorn">Save</ScalarButton>
</template>
```

### `ScalarModal` (`/modal`)

Dialog built on Headless UI. `size` ranges `xxs` → `full`; variants for `form` / `search` / `error` layouts. Open/close via the `useModal()` hook. Includes entrance/exit animations.

### `ScalarCard` (`/card`)

Surface with `ScalarCardHeader`, `ScalarCardSection`, and `ScalarCardFooter` slots/sub-components. Uses `bg-b-*`, `border`, `rounded-lg`, and `shadow`. Reserve for genuine grouping — prefer information directly on `bg-b-1`.

### Floating components (`/dropdown`, `/listbox`, `/combobox`, `/popover`, `/tooltip`)

All compose `ScalarFloating` (Floating UI) for positioning, support keyboard navigation and click-outside, and constrain width with `max-w-radix-popper`. Use `ScalarDropdown` for action menus, `ScalarListbox` for single-select, `ScalarCombobox` for searchable/multi-select.

### `ScalarSidebar` (`/sidebar`)

Nested navigation with section/group/item/indent/search/footer sub-components. Consumes the `--scalar-sidebar-*` tokens and `--scalar-sidebar-indent` (20px) / `--scalar-sidebar-padding` (12px).
