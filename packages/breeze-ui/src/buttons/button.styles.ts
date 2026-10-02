/** Treatments, states and loading fills shared by `Button` and `IconButton`. */
export const buttonVariants = {
  base: {},
  compound: {
    loading: {
      danger: 'breeze:bg-breeze-on-brand/35',
      primary: 'breeze:bg-breeze-on-brand/35',
      quiet: 'breeze:bg-breeze-line-strong',
      secondary: 'breeze:bg-breeze-line-strong',
    },
  },
  size: {},
  state: {
    disabled: 'breeze:cursor-not-allowed breeze:opacity-50',
    loading: 'breeze:cursor-wait',
    loadingContent: 'breeze:opacity-0',
    loadingStatus: 'breeze:sr-only',
  },
  variant: {
    danger:
      'breeze:border-transparent breeze:bg-breeze-danger-fill breeze:text-breeze-on-brand breeze:data-[hovered]:bg-breeze-danger-hover breeze:data-[pressed]:bg-breeze-danger-hover',
    primary:
      'breeze:border-transparent breeze:bg-breeze-brand breeze:text-breeze-on-brand breeze:data-[hovered]:bg-breeze-brand-hover breeze:data-[pressed]:bg-breeze-brand-hover',
    quiet:
      'breeze:border-transparent breeze:bg-transparent breeze:text-breeze-brand-text breeze:data-[hovered]:bg-breeze-brand-soft breeze:data-[pressed]:bg-breeze-brand-soft',
    secondary:
      'breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:text-breeze-ink breeze:data-[hovered]:bg-breeze-sunken breeze:data-[pressed]:bg-breeze-sunken',
  },
} as const;

/** Button-specific visual treatments, shared by `Button` and `IconButton`. */
export type ButtonVariant = keyof typeof buttonVariants.variant;
