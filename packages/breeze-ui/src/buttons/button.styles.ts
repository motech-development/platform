export const buttonVariants = {
  base: {
    box: 'breeze:border breeze:border-solid breeze:rounded-breeze-ctl breeze:font-semibold breeze:any-pointer-coarse:min-inline-breeze-tap',
  },
  compound: {
    loading: {
      danger: 'breeze:bg-breeze-on-danger/35',
      primary: 'breeze:bg-breeze-on-brand/35',
      quiet: 'breeze:bg-breeze-line-strong',
      secondary: 'breeze:bg-breeze-line-strong',
    },
    // The design pads the filled primary wider than the other md treatments.
    md: {
      danger: 'breeze:ps-breeze-3 breeze:pe-breeze-3',
      primary: 'breeze:ps-[14px] breeze:pe-[14px]',
      secondary: 'breeze:ps-breeze-3 breeze:pe-breeze-3',
    },
  },
  // Sizes of a boxed, labelled button; IconButton has its own square sizes.
  size: {
    lg: 'breeze:min-block-breeze-lg breeze:ps-breeze-5 breeze:pe-breeze-5 breeze:py-breeze-3 breeze:text-breeze-sm',
    md: 'breeze:min-block-breeze-9 breeze:text-breeze-sm',
    sm: 'breeze:min-block-breeze-8 breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:text-breeze-xs',
  },
  state: {
    disabled: 'breeze:cursor-not-allowed breeze:opacity-50',
    loading: 'breeze:cursor-wait',
    loadingContent: 'breeze:opacity-0',
    loadingStatus: 'breeze:sr-only',
  },
  variant: {
    danger:
      'breeze:border-transparent breeze:bg-breeze-danger-fill breeze:text-breeze-on-danger breeze:data-[hovered]:bg-breeze-danger-hover breeze:data-[pressed]:bg-breeze-danger-hover',
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
