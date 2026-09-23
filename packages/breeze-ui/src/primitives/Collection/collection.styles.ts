/** Shared listbox geometry and descriptor treatment for collection controls. */
const collectionVariants = {
  base: {
    badge: 'breeze:ms-auto',
    content:
      'breeze:flex breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col breeze:gap-breeze-1',
    description:
      'breeze:text-breeze-xs breeze:font-normal breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    item: 'breeze:flex breeze:any-pointer-coarse:min-block-breeze-tap breeze:min-inline-size-0 breeze:items-start breeze:gap-breeze-2 breeze:rounded-breeze-sm breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:outline-offset-[-2px] breeze:data-[disabled]:cursor-not-allowed breeze:data-[disabled]:opacity-50 breeze:data-[focused]:bg-breeze-sunken breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[hovered]:bg-breeze-sunken breeze:data-[selected]:bg-breeze-brand-soft breeze:data-[selected]:text-breeze-brand-text',
    label: 'breeze:font-medium',
    listBox: 'breeze:min-inline-size-0 breeze:outline-none',
    popover:
      'breeze:min-inline-size-[var(--trigger-width)] breeze:max-inline-size-[calc(100vw-24px)] breeze:overflow-auto breeze:rounded-breeze-panel breeze:border breeze:border-solid breeze:border-breeze-line breeze:bg-breeze-surface breeze:p-breeze-1 breeze:shadow-breeze-overlay',
    selectedIndicator:
      'breeze:ms-auto breeze:block-size-breeze-4 breeze:inline-size-breeze-4 breeze:shrink-0 breeze:text-breeze-brand-text',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

export default collectionVariants;
