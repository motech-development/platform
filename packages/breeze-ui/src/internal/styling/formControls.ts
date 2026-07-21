import { tv } from 'tailwind-variants';

/** Shared value typography and sizing for Breeze form controls. */
export const formControlValueTypography =
  'font-[family-name:var(--breeze-font-body)] font-normal';

const formControlValue = tv({
  base: formControlValueTypography,
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'min-h-12 px-4 py-3 text-base leading-[1.4]',
      md: 'min-h-11 px-3 py-2.5 text-base leading-[1.4]',
      sm: 'min-h-8 px-2.5 py-1.5 text-xs leading-[1.4]',
    },
  },
});

export default formControlValue;
