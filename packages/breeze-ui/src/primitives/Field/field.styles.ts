/** Shared field chrome used by Breeze's flat field primitives. */
export const fieldVariants = {
  base: {
    control:
      'breeze:relative breeze:inline-grid breeze:min-inline-size-0 breeze:inline-size-full',
    description:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-normal breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    error:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-medium breeze:leading-breeze-snug breeze:text-breeze-danger',
    input:
      'breeze:min-block-breeze-md breeze:min-inline-size-0 breeze:inline-size-full breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:py-breeze-2 breeze:font-breeze-sans breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:outline-offset-2 breeze:placeholder:text-breeze-ink-3 breeze:data-[hovered]:border-breeze-brand breeze:data-[focus-visible]:outline-2 breeze:data-[focus-visible]:outline-solid breeze:data-[focus-visible]:outline-breeze-brand breeze:data-[invalid]:border-breeze-danger breeze:disabled:cursor-not-allowed breeze:disabled:bg-breeze-sunken breeze:disabled:opacity-60 breeze:read-only:cursor-default breeze:read-only:bg-breeze-sunken',
    label:
      'breeze:m-0 breeze:text-breeze-xs breeze:font-medium breeze:leading-breeze-snug breeze:text-breeze-ink',
    root: 'breeze:flex breeze:min-inline-size-0 breeze:flex-col breeze:gap-breeze-2',
    skeleton:
      'breeze:pointer-events-none breeze:[grid-area:1/1] breeze:min-block-breeze-md breeze:rounded-breeze-ctl',
  },
  compound: {},
  size: {},
  state: {
    loadingInput: 'breeze:!opacity-0',
  },
  variant: {},
} as const;

export function joinClassNames(
  ...classNames: Array<string | false | undefined>
): string {
  return classNames.filter(Boolean).join(' ');
}
